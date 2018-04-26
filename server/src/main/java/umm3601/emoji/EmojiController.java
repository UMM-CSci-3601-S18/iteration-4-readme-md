package umm3601.emoji;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import umm3601.SuperController;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class EmojiController extends SuperController {

    /**
     * Construct a controller for emojis.
     *
     * @param database the database containing emoji data
     */
    public EmojiController(MongoDatabase database) {
        this.gson = new Gson();
        this.database = database;
        this.collection = database.getCollection("emojis");
    }

    /*public String getEmoji(String id) {

        FindIterable<Document>  jsonEmojis
            = emojiCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonEmojis.iterator();
        if (iterator.hasNext()) {
            Document emoji = iterator.next();
            return emoji.toJson();
        } else {
            // We didn't find the desired emoji
            return null;
        }
    }


    //This doesn't do anything right now.
    public String getEmojis(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetOwner = (queryParams.get("owner")[0]);
            filterDoc = filterDoc.append("owner", targetOwner);
        }

        FindIterable<Document> matchingEmojis = emojiCollection.find(filterDoc);




        return JSON.serialize(matchingEmojis);
    }*/


    public String addNewEmoji(String ownerId, int mood, String date, String userId) {

        Document newEmoji = new Document();
        newEmoji.append("owner", ownerId);
        newEmoji.append("mood", mood);
        newEmoji.append("date", date);
        newEmoji.append("userId", userId);

        try {
            collection.insertOne(newEmoji);

            ObjectId id = newEmoji.getObjectId("_id");
            System.err.println("Successfully added new emoji [_id=" + id + ", owner=" + ownerId + ", mood="
                + mood + " date=" + date + ", userId=" + userId + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
