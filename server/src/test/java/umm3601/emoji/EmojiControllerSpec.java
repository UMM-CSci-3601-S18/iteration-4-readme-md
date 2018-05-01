
package umm3601.emoji;

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
import static org.junit.Assert.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class EmojiControllerSpec {
    private EmojiController emojiController;
    private ObjectId mattsId;
    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> emojiDocuments = db.getCollection("emojis");
        emojiDocuments.drop();
        List<Document> testEmojis = new ArrayList<>();
        testEmojis.add(Document.parse("{\n" +
            "                    owner: \"Ahnaf\",\n" +
            "                    mood: 5,\n" +
            "                    date: \"Wed Mar 1 2018 7:35:02 GMT-05000\",\n" +

            "                }"));
        testEmojis.add(Document.parse("{\n" +
            "                    owner: \"Chuck\",\n" +
            "                    mood: 3,\n" +
            "                    date: \"Wed Mar 3 2018 12:02:21 GMT-0500\",\n" +
            "                }"));
        testEmojis.add(Document.parse("{\n" +
            "                    owner: \"Kyle\",\n" +
            "                    mood: 2,\n" +
            "                    date: \"Wed Mar 1 2018 10:14:41 GMT-0500\",\n" +
            "                }"));

        mattsId = new ObjectId();
        BasicDBObject matt = new BasicDBObject("_id", mattsId);
        matt = matt.append("owner", "Matt")
            .append("mood", 1)
            .append("date", "11/11/2011 09:00");



        emojiDocuments.insertMany(testEmojis);
        emojiDocuments.insertOne(Document.parse(matt.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        emojiController = new EmojiController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
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

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllEmojis() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = emojiController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 emojis", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(EmojiControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Ahnaf", "Chuck", "Kyle", "Matt");
        assertEquals("Names should match", expectedNames, names);
    }


    @Test
    public void getEmojiById() {
        String jsonResult = emojiController.getItem(mattsId.toHexString());
        System.out.println(jsonResult);
        Document matt = Document.parse(jsonResult);

        assertEquals("Name should match", "Matt", matt.getString("owner"));
        String noJsonResult = emojiController.getItem(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }

    @Test
    public void addEmojiTest(){
        String newId = emojiController.addNewEmoji("Matt2",5,2,"8/20/2015 14:00", "");

        assertNotNull("Add new emoji should return true when an emoji is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("Matt2", new String[] { "Matt2" });
        String jsonResult = emojiController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(EmojiControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the owner of the new emoji", "Matt2", name.get(4));
    }

    @Test
    public void getEmojisByOwner(){
        Map<String, String[]> argMap = new HashMap<>();
        //This will search for emojis owned by Kyle
        argMap.put("owner", new String[] { "Kyle" });
        String jsonResult = emojiController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be one emoji entry", 1, docs.size());
        List<String> name = docs
            .stream()
            .map(EmojiControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Kyle");
        assertEquals("Names should match", expectedName, name);

    }

    



}


