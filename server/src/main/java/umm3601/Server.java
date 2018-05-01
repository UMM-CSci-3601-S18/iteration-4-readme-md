package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;
import umm3601.emoji.EmojiController;
import umm3601.emoji.EmojiRequestHandler;
import umm3601.goal.GoalRequestHandler;
import umm3601.goal.GoalController;
import umm3601.resources.ResourcesController;
import umm3601.resources.ResourcesRequestHandler;
import umm3601.journal.JournalController;
import umm3601.journal.JournalRequestHandler;
import umm3601.user.UserController;

import java.io.FileReader;
import java.io.IOException;
import java.util.Collections;


import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import org.json.*;

public class Server {
    private static final String databaseName = "dev";
    private static final int serverPort = 4567; // change to port 80 on the droplet

    public static void main(String[] args) throws IOException {

        MongoClient mongoClient = new MongoClient();
        MongoDatabase mongoDatabase = mongoClient.getDatabase(databaseName);

        EmojiController emojiController = new EmojiController(mongoDatabase);
        EmojiRequestHandler emojiRequestHandler = new EmojiRequestHandler(emojiController);

        GoalController goalController = new GoalController(mongoDatabase);
        GoalRequestHandler goalRequestHandler = new GoalRequestHandler(goalController);

        JournalController journalController = new JournalController(mongoDatabase);
        JournalRequestHandler journalRequestHandler = new JournalRequestHandler(journalController);

        ResourcesController resourcesController = new ResourcesController(mongoDatabase);
        ResourcesRequestHandler resourcesRequestHandler = new ResourcesRequestHandler(resourcesController);

        UserController userController = new UserController(mongoDatabase);

        //Configure Spark
        port(serverPort);
        enableDebugScreen();

        // Specify where assets like images will be "stored"
        staticFiles.location("/public");

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));


        // Simple example route
        get("/hello", (req, res) -> "Hello World");

        // Redirects for the "home" page
        redirect.get("", "/");
        redirect.get("/reports", "/");
        redirect.get("/resources", "/");
        redirect.get("/journaling", "/");
        redirect.get("/goals", "/");

        /// Resource Endpoints //////////////////////
        /////////////////////////////////////////////

        get("api/resources/:id", resourcesRequestHandler::getResourcesJSON);
        get("api/resources", resourcesRequestHandler::getResources);
        post("api/resources/new", resourcesRequestHandler::addNewResources);
        delete("api/resources/delete/:id", resourcesRequestHandler::deleteResource);

        /// Emotion Endpoints ///////////////////////
        /////////////////////////////////////////////

        get("api/emojis", emojiRequestHandler::getEmojis);
        get("api/emojis/:id", emojiRequestHandler::getEmojiJSON);
        post("api/emojis/new", emojiRequestHandler::addNewEmoji);

        /// Goal Endpoints //////////////////////////
        /////////////////////////////////////////////

        get("api/goals", goalRequestHandler::getGoals);
        get("api/goals/:id", goalRequestHandler::getGoalJSON);
        post("api/goals/edit", goalRequestHandler::editGoal);
        delete("api/goals/delete/:id", goalRequestHandler::deleteGoal);
        post("api/goals/new", goalRequestHandler::addNewGoal);

        /// Journal Endpoints ///////////////////////
        /////////////////////////////////////////////

        get("api/journaling", journalRequestHandler::getJournals);
        get("api/journaling/:id", journalRequestHandler::getJournalJSON);
        delete("api/journaling/delete/:id", journalRequestHandler::deleteJournal);
        post("api/journaling/new", journalRequestHandler::addNewJournal);
        post("api/journaling/edit", journalRequestHandler::editJournal);

        /// Login Endpoints /////////////////////////
        /////////////////////////////////////////////

        post("api/login", (req, res) -> {

            JSONObject obj = new JSONObject(req.body());
            String authCode = obj.getString("code");


            try {
                // We can create this later to keep our secret safe

                final String CLIENT_SECRET_FILE = "./src/main/java/umm3601/server_files/client_secret_file.json";

                GoogleClientSecrets clientSecrets =
                    GoogleClientSecrets.load(
                        JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));

                GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    // Specify the CLIENT_ID of the app that accesses the backend:
                    .setAudience(Collections.singletonList(clientSecrets.getDetails().getClientId()))
                    // Or, if multiple clients access the backend:
                    //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
                    .build();

//                GoogleTokenResponse tokenResponse =
//                    new GoogleAuthorizationCodeTokenRequest(
//                        new NetHttpTransport(),
//                        JacksonFactory.getDefaultInstance(),
//                        "https://www.googleapis.com/oauth2/v4/token",
//                        clientSecrets.getDetails().getClientId(),
//
//                        // Replace clientSecret with the localhost one if testing
//                        clientSecrets.getDetails().getClientSecret(),
//                        authCode,
//                        "http://localhost:9000")
//                        // Might need to be changed in production?
//
//                        // Specify the same redirect URI that you use with your web
//                        // app. If you don't have a web version of your app, you can
//                        // specify an empty string.
//                        .execute();


                GoogleIdToken idToken = verifier.verify(authCode);
                GoogleIdToken.Payload payload = idToken.getPayload();
                String subjectId = payload.getSubject();  // Use this value as a key to identify a user.
                String email = payload.getEmail();
                boolean emailVerified = payload.getEmailVerified();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String locale = (String) payload.get("locale");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");


                System.out.println(subjectId);
                System.out.println(email);
                System.out.println(name);
                System.out.println(locale);

                return userController.addNewUser(subjectId, givenName, familyName);

            } catch (Exception e) {
                System.out.println(e);
            }

            return "";
        });

        // An example of throwing an unhandled exception so you can see how the
        // Java Spark debugger displays errors like this.
        get("api/error", (req, res) -> {
            throw new RuntimeException("A demonstration error");
        });

        // Called after each request to insert the GZIP header into the response.
        // This causes the response to be compressed _if_ the client specified
        // in their request that they can accept compressed responses.
        // There's a similar "before" method that can be used to modify requests
        // before they they're processed by things like `get`.
        after("*", Server::addGzipHeader);

        // Handle "404" file not found requests:
        notFound((req, res) -> {
            res.type("text");
            res.status(404);
            return "Sorry, we couldn't find that!";
        });
    }

    // Enable GZIP for all responses
    private static void addGzipHeader(Request request, Response response) {
        response.header("Content-Encoding", "gzip");
    }
}
