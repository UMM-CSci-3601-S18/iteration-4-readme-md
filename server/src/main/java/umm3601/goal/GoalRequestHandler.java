package umm3601.goal;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;


public class GoalRequestHandler {
    private final GoalController goalController;
    public GoalRequestHandler(GoalController goalController){
        this.goalController = goalController;
    }
    /**Method called from Server when the 'api/goals/:id' endpoint is received.
     * Get a JSON response with a list of all the goals in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one emoji in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getGoalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String goal;
        try {
            goal = goalController.getItem(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested emoji id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (goal != null) {
            return goal;
        } else {
            res.status(404);
            res.body("The requested goal with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/goals' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of goals in JSON formatted String
     */
    public String getGoals(Request req, Response res)
    {
        res.type("application/json");
        return goalController.getItems(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/goals/new'endpoint is recieved.
     * Gets specified goal info from request and calls addNewGoal helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the goal was added successfully or not
     */
    public String addNewGoal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String purpose = dbO.getString("purpose");
                    String category = dbO.getString("category");
                    String name = dbO.getString("name");
                    Boolean status = dbO.getBoolean("status");
                    String userId = dbO.getString("userId");

//
//                    System.err.println("Adding new emoji [owner=" + owner + ", mood=" + mood + " date=" + date  + ']');
                    return goalController.addNewGoal(purpose, category, name, status, userId);
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

    public String editGoal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the item with itemController's editGoal method
            if(o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String purpose = dbO.getString("purpose");
                    String category = dbO.getString("category");
                    String name = dbO.getString("name");
                    Boolean status = dbO.getBoolean("status");

                    System.err.println("Editing goal [purpose=" + purpose + ", category=" + category + ", name=" + name + ", status=" + status + ']');
                    return goalController.editGoal(id, purpose, category, name, status).toString();
                } catch (NullPointerException e) {
                    System.err.println("A value was malformed or omitted, new item request failed.");
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

    public String deleteGoal(Request req, Response res){

        System.out.println("I'm here");
        System.out.println(req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            goalController.deleteGoal(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
