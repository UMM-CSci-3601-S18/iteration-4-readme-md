package umm3601.goal;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class GoalControllerSpec {
    private GoalController goalController;
    private ObjectId huntersID;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> goalDocuments = db.getCollection("goals");

        goalDocuments.drop();

        List<Document> testGoals = new ArrayList<>();
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Clean my room\",\n" +
            "                    purpose: \"To have a better environment\",\n" +
            "                    category: \"Living\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Wash dishes\",\n" +
            "                    purpose: \"Cleaner kitchen\",\n" +
            "                    category: \"Chores\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Make cookies\",\n" +
            "                    purpose: \"Get fatter\",\n" +
            "                    category: \"Food\",\n" +
            "                }"));

        huntersID = new ObjectId();
        BasicDBObject hunter = new BasicDBObject("_id", huntersID);
        hunter = hunter.append("name", "Call mom")
            .append("purpose", "Improve relationship")
            .append("category", "Family");

        goalDocuments.insertMany(testGoals);
        goalDocuments.insertOne(Document.parse(hunter.toJson()));

        goalController = new GoalController(db);
    }

    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getPurpose(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("purpose")).getValue();
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    @Test
    public void getNoGoals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = goalController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 0 goals", 0, docs.size());

    }

//    @Test
//    public void getGoalByCategory(){
//        Map<String, String[]> argMap = new HashMap<>();
//        // Mongo in GoalController is doing a regex search so can just take a Java Reg. Expression
//        // This will search the category for letters 'f' and 'c'.
//        argMap.put("category", new String[] { "Living" });
//        String jsonResult = goalController.getItems(argMap);
//        BsonArray docs = parseJsonArray(jsonResult);
//        assertEquals("Should be 3 goals", 3, docs.size());
//        List<String> name = docs
//            .stream()
//            .map(GoalControllerSpec::getName)
//            .sorted()
//            .collect(Collectors.toList());
//        List<String> expectedName = Arrays.asList("Call mom","Make cookies","Wash dishes");
//        assertEquals("Names should match", expectedName, name);
//    }

    @Test
    public void getHuntersByID() {
        String jsonResult = goalController.getItem(huntersID.toHexString());
        Document hunterDoc = Document.parse(jsonResult);
        assertEquals("Name should match", "Call mom", hunterDoc.get("name"));
        String noJsonResult = goalController.getItem(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);
    }

    @Test
    public void addGoalTest(){
        String newId = goalController.addNewGoal("Self defense from Bobs", "Injury", "Kick Bob", false, "test@gmail.com");

        assertNotNull("Add new goal should return true when goal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userId", new String[]{"test@gmail.com"});
        String jsonResult = goalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> purpose = docs
            .stream()
            .map(GoalControllerSpec::getPurpose)
            .sorted()
            .collect(Collectors.toList());
        // name.get(0) says to get the name of the first person in the database,
        // so "Bob" will probably always be first because it is sorted alphabetically.
        // 3/4/18: Not necessarily: it is likely that that is how they're stored but we don't know. Find a different way of doing this.
        assertEquals("Should return purpose of new goal", "Self defense from Bobs", purpose.get(0));
    }

    @Test
    public void editGoalTest() {
        String newId = goalController.editGoal("5ab53a8907d923f68d03e1a3", "To have a better environment", "Family", "Hug KK", true);
        assertNotNull("Edit goal should return true when goal is edited,", newId);
    }

    @Test
    public void deleteGoalTest(){
        System.out.println("HuntersID " + huntersID.toHexString());

        String jsonResult = goalController.getItem(huntersID.toHexString());
        // should exist
        Document goal = Document.parse(jsonResult);
        assertEquals("Resource should exist", "Call mom", goal.getString("name"));

        goalController.deleteGoal(huntersID.toHexString());


        jsonResult = goalController.getItem(huntersID.toHexString());
        // should not exist
        assertNull(jsonResult);

//        //Adding new goal
//        //Then deleting newly added goal and see if it still works
//        String newId = goalController.addNewGoal("Self defense from Bobs", "Injury", "Kick Bob", false);
//
//        assertNotNull("Add new goal should return true when goal is added,", newId);
//
//        Map<String, String[]> argMap2 = new HashMap<>();
//        String jsonResult2 = goalController.getGoals(argMap2);
//        BsonArray docs2 = parseJsonArray(jsonResult2);
//        assertEquals("Should be 4 goals", 4, docs2.size());
//
//        Map<String, String[]> argMap4 = new HashMap<>();
//        // Mongo in GoalController is doing a regex search so can just take a Java Reg. Expression
//        // This will search the category for letters 'f' and 'c'.
//        argMap4.put("purpose", new String[] { "[Self defense from Bobs]" });
//        String jsonResult4 = goalController.getGoals(argMap4);
//        BsonArray docs4 = parseJsonArray(jsonResult4);
//
//        //goalController.deleteGoal(newId);
//        Map<String, String[]> argMap3 = new HashMap<>();
//        String jsonResult3 = goalController.getGoals(argMap3);
//        BsonArray docs3 = parseJsonArray(jsonResult3);
//        assertEquals("Should be 3 goals", 1, docs4.size());
    }
}
