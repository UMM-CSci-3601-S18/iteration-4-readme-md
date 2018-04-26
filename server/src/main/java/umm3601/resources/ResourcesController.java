package umm3601.resources;

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

public class ResourcesController extends SuperController{

    /**
     * Construct a controller for resources.
     *
     * @param database the database containing resources data
     */
    public ResourcesController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        collection = database.getCollection("resources");
    }

    /*public String getResources(String id) {

        FindIterable<Document> jsonResources
            = resourcesCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonResources.iterator();
        if (iterator.hasNext()) {
            Document resource = iterator.next();
            return resource.toJson();
        } else {
            // We didn't find the desired Resource
            return null;
        }
    }


    public String getResources(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetName);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingResources = resourcesCollection.find(filterDoc);


        return JSON.serialize(matchingResources);
    }
*/

    public String addNewResources(String name, String body, String phone, String userId) {

        Document newResources = new Document();
        newResources.append("name", name);
        newResources.append("body", body);
        newResources.append("phone", phone);
        newResources.append("userId", userId);



        try {
            collection.insertOne(newResources);

            ObjectId Id = newResources.getObjectId("_id");
            System.err.println("Successfully added new resource [name=" + name +
                ", body=" + body + " phone=" + phone +  " userId=" + userId + ']');

            return JSON.serialize(Id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteResource(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));

        try {
            collection.deleteOne(searchQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted resource " + id1);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }
}
