var app = angular.module('enthub.services', []);

/**
 * A simple example service that returns questions data.
 * Please load before save
 */

app.factory('Users', function() {
    // Might use a resource here that returns a JSON array

    var users = {
        "co271b": {
            fname: "Christina",
            lname: "Olk",
            username: "co271b",
            email: "co271b@att.com",
            pass: "pass"
            //reward points possibly could be added here
        },
        "user": {
            fname: "Test",
            lname: "Account",
            username: "user",
            email: "user.name@fakeaccount.com",
            pass: "pass"
            //reward points possibly could be added here
        }

    };

    return {
        getUID: function() {
            var d = new Date();
            return d.getTime();
        },
        add: function(user) {
            //adding the user and using the attuid as a key
            if (!users[user.attuid])
                users[user.attuid] = user;
        },
        load: function() {
            users = JSON.parse(window.localStorage['users'] || JSON.stringify(users));
        },
        save: function() {
            window.localStorage['users'] = JSON.stringify(users);
        },
        all: function() {
            return users;
        },
        get: function(attuid) {
            return users[attuid];
        }
    }
});

app.factory('LoginAttempts', function($http) {
    // Might use a resource here that returns a JSON array

    var attempts = {"127.0.0.1": {"ipAddress":"127.0.0.1","Attempts":2}};
    var timeoutVar = false;
    var tempIP;

    return {
       
        addLoginAttempt: function(ip) {
            attempts = JSON.parse(window.localStorage['attempts'] || JSON.stringify(attempts));
           
            attempts[ip].Attempts = attempts[ip].Attempts + 1;
            window.localStorage['attempts'] = JSON.stringify(attempts);
        },
        save: function() {
            ;
        },
        resetAttemptCount: function(ip){
            attempts = JSON.parse(window.localStorage['attempts'] || JSON.stringify(attempts));
            attempts[ip].Attempts = 0;
            window.localStorage['attempts'] = JSON.stringify(attempts);

        },
        get: function(attemptIndex) {
            // Simple index lookup
            return attempts[attemptIndex];
        },
        getAttemptCount: function(ip) {
            console.log(attempts[ip].Attempts);
            return attempts[ip].Attempts;
        }, 
        getTimeoutVar: function(){
            return timeoutVar;
        },
        loginTimeout: function(ip){
            attempts = JSON.parse(window.localStorage['attempts'] || JSON.stringify(attempts));
            timeoutVar = true;
            setTimeout(function(){
                timeoutVar = false; 
                attempts[ip].Attempts = 0;
                window.localStorage['attempts'] = JSON.stringify(attempts);
                location.reload();}, 10000);
        },
        loadCurrentUserIPAndCreateAttempt: function(){
            
            if((window.localStorage['attempts'] || JSON.stringify(attempts)) ==undefined)
            {
               //just use the sample data initialized at the 
               //at the beginning of this service
            }
            else
                attempts = JSON.parse(window.localStorage['attempts'] || JSON.stringify(attempts));

            //$http.get('http://jsonip.com')
              //  .success(function(data){ tempIP = data.ip; alert(tempIP);});

            //angular js http library is by default async, so using
            //JS to perform a sync request
            var request = new XMLHttpRequest();
            request.open('GET', 'http://jsonip.com', false);  // `false` makes the request synchronous
            request.send(null);

            if (request.status === 200) {
              //console.log(request.responseText);
              tempIP = JSON.parse(request.response).ip;
            }

            var tempAttempt = {ipAddress: tempIP, Attempts:0};
            attempts[tempIP] = tempAttempt;
            window.localStorage['attempts'] = JSON.stringify(attempts);

            return tempIP;

        },
        isInTimeout: function(){
            if(timeoutVar)
            {
                return false;
            }
            else
                return true;
        }
    }
});


app.factory('TestData', function() {

    // Some fake testing data
    var testData = [{
        title: 'Reggae',
        id: 1
    }, {
        title: 'Chill',
        id: 2
    }, {
        title: 'Dubstep',
        id: 3
    }, {
        title: 'Indie',
        id: 4
    }, {
        title: 'Rap',
        id: 5
    }, {
        title: 'Cowbell',
        id: 6
    }];

    return {
        load: function() {
            testData = JSON.parse(window.localStorage['testData'] || JSON.stringify(testData));
        },
        save: function() {
            window.localStorage['testData'] = JSON.stringify(testData);
        },
        all: function() {
            return testData;
        },
        get: function(index) {
            // Simple index lookup
            return testData[index];
        }
    }
});

