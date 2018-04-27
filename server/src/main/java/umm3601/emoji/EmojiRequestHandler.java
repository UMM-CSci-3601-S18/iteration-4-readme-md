package umm3601.emoji;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class EmojiRequestHandler {
    private final EmojiController emojiController;
    public EmojiRequestHandler(EmojiController emojiController){
        this.emojiController = emojiController;
    }
    /**Method called from Server when the 'api/emojis/:id' endpoint is received.
     * Get a JSON response with a list of all the emojis in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one emoji in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getEmojiJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String emoji;
        try {
            emoji = emojiController.getItem(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested emoji id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (emoji != null) {
            return emoji;
        } else {
            res.status(404);
            res.body("The requested emoji with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/emojis' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of emojis in JSON formatted String
     */
    public String getEmojis(Request req, Response res)
    {
        res.type("application/json");
        return emojiController.getItems(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/emojis/new'endpoint is recieved.
     * Gets specified emoji info from request and calls addNewEmoji helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the emoji was added successfully or not
     */
    public String addNewEmoji(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String owner = dbO.getString("owner");
                    int mood = dbO.getInt("mood");
                    int intensity = dbO.getInt("intensity");
                    String date = dbO.getString("date");
                    String userId = dbO.getString("userId");

                    System.err.println("Adding new emoji [owner=" + owner + ", mood=" + mood + " intensity=" + intensity +
                        " date=" + date  + " userId=" + userId +']');
                    return emojiController.addNewEmoji(owner, mood, intensity, date, email);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new emoji request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
