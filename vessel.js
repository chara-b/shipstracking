var vessel = {
    load : function(data){
        this.id = new Number(data[0]);    //big dataset
        this.imo = new Number(data[1]);
        this.lat = data[2].replace(',','.')-0; //replace ',' to '.'
        this.lng = data[3].replace(',','.')-0; //replace ',' to '.'
        this.course = new Number(data[4]);
        this.heading = new Number(data[5]);
        this.speed = new Number(data[6]);
        this.timestamp = (new Date(data[7])).getTime()/1000;    //turn human readable timestamp to unix time/date to make calcs easier
        this.name = data[8];
        this.type_name = data[9];
        this.destination = data[10];
        this.navigation = data[11];
    },
};

module.exports = vessel;