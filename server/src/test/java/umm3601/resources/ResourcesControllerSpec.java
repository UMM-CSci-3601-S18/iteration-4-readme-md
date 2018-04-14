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
            "                    email: \"Lir@Fealladh.com\",\n" +
            "                }"));
        testResource.add(Document.parse("{\n" +
            "                    _id: \"5ab2bc37bc8681f8f0ddf797\",\n" +
            "                    name: \"Reina\",\n" +
            "                    body: \"My best friend\",\n" +
            "                    phone: \"555-555-5551\",\n" +
            "                    email: \"Reina@myfriend.com\",\n" +
            "                }"));
        testResource.add(Document.parse("{\n" +
            "                    _id: \"5ab2bc370290adc56f8065fc\",\n" +
            "                    name: \"Suicide Prevention Lifeline\",\n" +
            "                    body: \"We can all help prevent suicide. The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.\",\n" +
            "                    phone: \"1-800-555-5555\",\n" +
            "                    email: \"preventsuicide@lifeline.org\",\n" +
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

    private static String getEmail(BsonValue value) {
        BsonDocument doc = value.asDocument();
        return ((BsonString) doc.get("email")).getValue();
    }

    @Test
    public void getAllResources() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = resourceController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 resources", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(ResourcesControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Flora Hull", "Lir Fealladh", "Reina", "Suicide Prevention Lifeline");
        assertEquals("Names should match", expectedNames, names);
       /* List<String> emails = docs
            .stream()
            .map(ResourcesControllerSpec::getEmail)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedEmails = Arrays.asList("florahull@flowershopquestionmark.net", "Lir@Fealladh.com", "preventsuicide@lifeline.org", "Reina@myfriend.com");
        assertEquals("Emails should match", expectedEmails, emails);*/
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
        argMap.put("Rik", new String[]{"Rik"});
        String jsonResult = resourceController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> email = docs
            .stream()
            .map(ResourcesControllerSpec::getEmail)
            .sorted()
            .collect(Collectors.toList());
        /*assertEquals("Should return the owner of the new resource", "rik12365@gmail.com", email.get(1));*/
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
