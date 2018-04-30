package umm3601.resources;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.ControllerSuperSpec;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ResourcesControllerSpec extends ControllerSuperSpec{
    private ResourcesController resourceController;
    private ObjectId floraId;

    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> resourceDocuments = db.getCollection("resources");
        resourceDocuments.drop();
        List<Document> testResource = new ArrayList<>();
        testResource.add(Document.parse("{\n" +
            "                    _id: \"5ab2bc3742f5a7b6f0f48626\",\n" +
            "                    name: \"Lir Fealladh\",\n" +
            "                    body: \"My Father\",\n" +
            "                    phone: \"555-555-5550\",\n" +
            "                    userId: \"Lir@Fealladh.com\",\n" +
            "                }"));
        testResource.add(Document.parse("{\n" +
            "                    _id: \"5ab2bc37bc8681f8f0ddf797\",\n" +
            "                    name: \"Reina\",\n" +
            "                    body: \"My best friend\",\n" +
            "                    phone: \"555-555-5551\",\n" +
            "                    userId: \"Reina@myfriend.com\",\n" +
            "                }"));
        testResource.add(Document.parse("{\n" +
            "                    _id: \"5ab2bc370290adc56f8065fc\",\n" +
            "                    name: \"Suicide Prevention Lifeline\",\n" +
            "                    body: \"We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.\",\n" +
            "                    phone: \"1-800-555-5555\",\n" +
            "                    userId: \"preventsuicide@lifeline.org\",\n" +
            "                }"));

        floraId = new ObjectId();
        BasicDBObject flora = new BasicDBObject("_id", floraId);
        flora = flora.append("resourcesId", "5ab2bc399990adc56f8065fz")
            .append("name", "Flora Hull")
            .append("body", "Flower shop?")
            .append("phone", "922-486-2948")
            .append("email", "florahull@flowershopquestionmark.net");
        resourceDocuments.insertMany(testResource);
        resourceDocuments.insertOne(Document.parse(flora.toJson()));

        resourceController = new ResourcesController(db);
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    private static String getUserId(BsonValue value) {
        BsonDocument doc = value.asDocument();
        return ((BsonString) doc.get("userId")).getValue();
    }

    @Test
    public void getNoResources() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = resourceController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        // returns nothing when no userId is given
        assertEquals("Should be 0 resources", 0, docs.size());

    }

    @Test
    public void getResourceById() {
        String jsonResult = resourceController.getItem(floraId.toHexString());
        System.out.println(jsonResult);
        Document flora = Document.parse(jsonResult);

        assertEquals("Name should match", "Flora Hull", flora.getString("name"));
        String noJsonResult = resourceController.getItem(new ObjectId().toHexString());
        assertNull("No name should match",noJsonResult);
    }

    @Test
    public void addResourceTest() {
        String newId = resourceController.addNewResources("Rik", "My Brother", "555-555-5589", "rik12365@gmail.com");

        assertNotNull("Add new resource should return true when an resource is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userId", new String[]{"rik12365@gmail.com"});
        String jsonResult = resourceController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> email = docs
            .stream()
            .map(ResourcesControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the owner of the new resource", "Rik", email.get(0));
    }

    @Test
    public void deleteResourceTest() {
        String flora = floraId.toHexString();

        String jsonResult = resourceController.getItem(flora);
        // should exist
        Document resource = Document.parse(jsonResult);
        assertEquals("Resource should exist", "Flora Hull", resource.getString("name"));

        resourceController.deleteResource(flora);

        jsonResult = resourceController.getItem(flora);
        // should not exist
        assertNull(jsonResult);
    }

   /* Future iteration test for filtering resources by name if so desired.
     //@Test
    public void getResourcesByName(){
        Map<String, String[]> argMap = new HashMap<>();
        //This will search for resources owned by Kyle
        argMap.put("name", new String[] { "Hayden Cain" });
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be one resource entry", 1, docs.size());
        List<String> name = docs
            .stream()
            .map(ResourcesControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Hayden Cain");
        assertEquals("Names should match", expectedName, name);

    }*/


}
