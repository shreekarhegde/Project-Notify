const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Department }  = require('./department');
const { Employee } = require('./employee');
delete mongoose.connection.models['Activity'];


const activitySchema = new Schema({
    activityName: {
        type: String,
        minlength: 3,
        required: true
    },
    about: {
        type: String,
        minlength: 5
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    departments: [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }],
    venue: {
        type: String,
        minlength: 3
    },
    guests: [{
            type: String
    }],
    schedule: {
        time: {
            type: String,
            required: true
            },
        date: {
            type: Date,
            required: true
            }
        }
});


activitySchema.post('save', function(next){
    let activityId = this._id;
    let departmentId = this.departments;
    console.log(departmentId);
    let participants = this.participants;
    Employee.updateMany({_id: {$in: participants}}, {$push: {activities: activityId}}).then((participants) => {        
        console.log(participants); 
    });
    Department.updateMany({_id: departmentId}, {$push: {activities: activityId}}).then((department) => {        
        console.log(department); 
    }).catch((err) => {
        console.log(err);
    })
});


const Activity = mongoose.model('Activity', activitySchema);


module.exports = {
    Activity
}