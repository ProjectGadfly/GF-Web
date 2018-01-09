import requests
from flask import request
from flask import Flask
from flask import Response
import json
from bs4 import BeautifulSoup
import MySQLdb 
import base64
from os import urandom

GFServer = Flask(__name__)

# Config info -- most of this should be *elsewhere*, not committed to public repos!
DBIP = "127.0.0.1"
DBUser = "gadfly_user"
DBName = "gadfly"
DBPasswd = "gadfly_pw"


# Keys should be removed from GFServer.py
GGkey=r"AIzaSyD9-4_5QUmogkjgvXdMGYVemsUEVVfy8tI"
PPkey=r"2PvUNGIQHTaDhSCa3E5WD1klEX67ajkM5eLGkgkO"
OOkey=r"1c8b6a93-163d-4d50-a6da-4699b316dd03"
APIkey="v1key"


#get geo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


def addrToGeo(LLData):
    """ Purpose:
        Get both state and latitude/longitude in one call (saves hits on our Google API key, so it's
        worth a little extra trouble).
        Returns:
        A dictionary
    """
    print("Converting address")
    result = dict()
    result['LL'] = LLData['results'][0]['geometry']['location']
    for c in LLData['results'][0]['address_components']:
        if 'administrative_area_level_1' in c['types']:
            result['state'] = c['short_name']
            break
    print("finished converting address")
    return result

def fetchDistrict(ad):
    """ Purpose:
        Fetches federal district based upon the address passed as a parameter
    """
    URL = r"https://www.googleapis.com/civicinfo/v2/representatives?key=" + GGkey + "&address=" + ad + "&levels=country&roles=legislatorLowerBody"
    DReq = requests.get(URL)
    DInfo = DReq.text
    DData = json.loads(DInfo)
    if 'error' in DData:
        return -1
    else:
        if 'offices' in DData:
            for office in DData['offices']:
                if 'legislatorLowerBody' in office['roles']:
                    D = office['divisionId'].rsplit(':')[-1]
                    return D
        return -1

# end get geo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# support functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`


def fetchPhoto(twitter):
    URL = r'https://twitter.com/' + twitter
    source = requests.get(URL)
    picURL = ""
    plain_text = source.text
    soup = BeautifulSoup(plain_text,"html.parser")
    for photo in soup.find_all('img', {'class':'ProfileAvatar-image '}):
        picURL = photo.get('src')
    return picURL



# end support functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`


# classes~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class state:
    def __init__(self, data):
        self.name=data['full_name'] if 'full_name' in data else None
        self.phone = None
        for office in data['offices']:
            if office['name'] == 'Home Office':
                self.phone=None
                continue
            else:
                self.phone=office['phone'] if 'phone' in office else None
        self.picURL = data['photo_url'] if 'photo_url' in data else None
        self.party = data['party'] if 'party' in data else None
        self.email = data['email'] if 'email' in data else None
        self.tags = list()
        LOH = data['roles'][0]['chamber']
        if LOH == 'lower':
            #self.senOrRep = 1
            self.tags.append(TagIDs['representative'])
        else:
            self.tags.append(TagIDs['senator'])
        self.tags.append(TagIDs['state'])

    def returnDict(self):
        dict = {'name':self.name,'phone':self.phone,'picURL':self.picURL,'email':self.email,'party':self.party,'tags':self.tags}
        return dict


class federal:
    def __init__(self, data):
        self.tags = list()
        self.name = data['first_name'] + ' ' + data['last_name']
        self.phone = data['roles'][0]['phone']
        self.picURL = fetchPhoto(data['twitter_account'])
        if data['current_party'] == 'R':
            self.party = 'Republican'
        elif data['current_party'] == 'D':
            self.party = 'Democratic'
            # data source appears inconsistent here!
        elif data['current_party'] == 'I' or data['current_party'] == 'ID':
            self.party = 'Independent'
        else:
            self.party = 'Unknown'
        if data['roles'][0]['chamber'] == 'House':
            # array of tag id's
            self.tags.append(TagIDs["representative"])
        else:
            self.tags.append(TagIDs["senator"])
        self.tags.append(TagIDs["federal"])

    def returnDict(self):
        """    Purpose:
            Puts all of the data from this federal object into a dictionary
        """
        dict = {'name':self.name, 'phone':self.phone, 'picURL':self.picURL,'email':'', 'party':self.party, 'tags':self.tags}
        return dict

#end classes~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``


#fetch functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

def fetchFederal(state, district):
    """    Purpose:
        Returns the list of federal objects
    """
    print("Fetching fed!")
    fed = []
    key = ""
    sURL = r"https://api.propublica.org/congress/v1/members/senate/" + state + r"/current.json"
    hURL = r"https://api.propublica.org/congress/v1/members/house/" + state + "/" + str(district) + r"/current.json"
    sReq = requests.get(sURL,headers = {"X-API-Key":PPkey})
    sInfo = sReq.text
    sData = json.loads(sInfo)
    for s in sData['results']:
        URL = r"https://api.propublica.org/congress/v1/members/"+s['id']+".json"
        ssReq = requests.get(URL,headers={"X-API-Key":PPkey})
        ssInfo = ssReq.text
        ssData = json.loads(ssInfo)
        ss = ssData['results'][0]
        # new federal class
        ssObject = federal(ss)
        fed.append(ssObject.returnDict())
    hReq = requests.get(hURL,headers = {"X-API-Key":PPkey})
    hInfo = hReq.text
    hData = json.loads(hInfo)
    for h in hData['results']:
        URL = r"https://api.propublica.org/congress/v1/members/" + h['id'] + ".json"
        hhReq = requests.get(URL,headers = {"X-API-Key":PPkey})
        hhInfo = hhReq.text
        hhData = json.loads(hhInfo)
        hh=hhData['results'][0]
        hhObject=federal(hh)
        fed.append(hhObject.returnDict())
    print("Fetched fed!")
    return fed

def fetchStateRep(lat, lng):
    """Purpose:
    Returns the state representatives' data
    """
    URL = r"https://openstates.org/api/v1/legislators/geo/?lat=" + str(lat) + "&long=" + str(lng)
    stateReq = requests.get(URL,headers = {"X-API-KEY":OOkey})
    stateInfo = stateReq.text
    stateData = json.loads(stateInfo)
    return stateData

def fetchState(LL):
    """Purpose:
        Fetch all state reps matching the latitude and longitude
    """
    print("Fetching state!")
    ST = fetchStateRep(LL['lat'], LL['lng'])
    stData = []
    for st in ST:
        stObject = state(st)
        stData.append(stObject.returnDict())
    print("Fetched state!")
    return stData

#end fetch functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``




#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# GFServer = how flask gets inserted into the sequence of events
# @ invokes a python process called decoration, applies this function and these
# parameters to postScript,

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


def get_representatives_helper(LLData,district):
    """ Purpose:
        Retreive geocode location from address
        Retreive state and federal representatives from data providers
    """
    print("Start convert address")
    dict_coord_state = addrToGeo(LLData)
    ll = dict_coord_state['LL']
    state = dict_coord_state['state']
    # retreive federal data
    print("Start fetch fed")
    federals = fetchFederal(state, district)
    # retreive state data
    print("Start fetch state")
    states = fetchState(ll)
    # Merge and return federal and state
    result_dict=dict()
    result_dict['Status']='OK'
    results = federals
    results.extend(states)
    result_dict['Results']=results
    return result_dict



@GFServer.route('/v1/representatives', methods=['GET'])
def getRepresentatives():
    """ Description:
        Gets information on senators and representatives given an address.
        Returns:
                name: string,
                phone: integer,
                picURL: string,
                email: string,
                party: string,
                tag_names: [list of strings]
    """
    key = request.headers.get('APIKey')
    if (key != APIkey):
        return Response('Error: Wrong API Key!', status=401)
    address = request.args['address']
    URL = r'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + GGkey
    print("Getting google")
    LLData = json.loads(requests.get(URL).text)
    print("Got google")
    msg=dict()
    if LLData['status'] != 'OK':
        msg['Status']='invalid address'
        resp = Response(json.dumps(msg), status=404, mimetype='application/json')
        return resp
    for c in LLData['results'][0]['address_components']:
        if 'country' in c['types']:
            if c['short_name'] != 'US':
                msg['Status']='address should be in US'
                resp = Response(json.dumps(msg), status=404, mimetype='application/json')
                return resp
            break
    if len(LLData['results'][0]['address_components'])<3:
        msg['Status']='address too broad'
        resp = Response(json.dumps(msg), status=404, mimetype='application/json')
        return resp
    print("address is ok")
    print(LLData)
    district = fetchDistrict(LLData['results'][0]['formatted_address'].replace(' ','+'))
    if district == -1:
        msg['Status']='invalid address'
        resp = Response(json.dumps(msg), status=404, mimetype='application/json')
        return resp
    # Retreive representative data from helper function
    try:
        print("try fetch reps")
        all_reps = get_representatives_helper(LLData,district)
        js = json.dumps(all_reps)
        resp = Response(js, status=200, mimetype='application/json')
        return resp
    except:
        print("having troubles")
        msg['Status']='Failed to get reps'
        resp = Response(json.dumps(msg), status=404, mimetype='application/json')
        return resp



# post new script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

def random_ticket_gen():
    """Description:
        Returns a ticket wich is a 32 byte base 64 random value in string form
    """
    ticket = base64.b64encode(urandom(24))
    return ticket



def insert_new_script(sdict):
    """Purpose:

        Takes the fields provided in the dict parameter and adds a
        unique randomly generated ticket to the dict to create a new
        script.

        Returns:
        A dict, with ticket and id
    """

    # cnx is the connection to the database
    cnx = MySQLdb.connect(host = DBIP, user = DBUser, passwd = DBPasswd, db = DBName)
    cursor = cnx.cursor()
    no_success = True
    # Loop and transaction ensure ticket will be unique even though random
	#cursor.execute("START TRANSACTION")
    while(no_success):
        ticket = str(random_ticket_gen())
        length=len(ticket)
        ticket=ticket[2:length-1]
        command="SELECT EXISTS(SELECT title FROM call_scripts WHERE ticket=%s)"
        cursor.execute(command,(ticket,))
        result=cursor.fetchone()[0]
        if result==0:
            no_success=False
    sdict['ticket'] = ticket
    print("start to try")
    try:
        print("start to execute")
        # creates a row in the call script table
        command="INSERT INTO call_scripts (title, content, ticket, expiration_date) VALUES (%s, %s, %s, CURDATE() + INTERVAL 6 MONTH)"
        print(command)
        cursor.execute(command,(sdict['title'], sdict['content'], sdict['ticket']))
        print('start ot get id')
        new_id = cnx.insert_id()
        print("new id is "+str(new_id))
        no_success = False
        print("start to insert tags")
        # Create new entries in table to associate scripts and tags
        for tag_id in sdict['tags']:
            command="INSERT INTO link_callscripts_tags (call_script_id, tag_id) VALUES (%s, %s)"
            cursor.execute(command,(new_id,tag_id))
        cnx.commit()
        """
            If email sending is added it will be added here
        """
		#except MySqlException as e:
            # 1062 is a unique column value exception, the ticket has a match in the table
            # the second condition determines which column failed
			#if e.Number == 1062 and "key 'ticket'" in e.Message:
			#    cnx.rollback()
			#else:
                # Some other error was encountered and rollback will happen automatically
			#    raise
    except:
        cnx.close()
        result=dict()
        result['Status']='Failed to post'
        resp = Response(json.dumps(result), status=404, mimetype='application/json')
        return resp
    cnx.close()
    result=dict()
    result['Status']='OK'
    result['ticket']=ticket
    result['id']=new_id
    resp = Response(json.dumps(result), status=200, mimetype='application/json')
    return resp

dicta={'title':'test','content':'testcontent','tags':[1,2,3]}
print("titlellllllllll"+str(dicta['tags'][0]))

@GFServer.route('/v1/script', methods=['POST'])
def postScript():
    """
    Purpose:
    Posts a new script given information inputted by a user and returns a unique ticket.
    This ticket will be in the unique URL to that script for the user to access if they want to delete the script in the future.
    Returns:
    A dict with a ticket and a id
    """
    print ("postScript")
    key = request.headers.get('APIKey')
    if (key != APIkey):
        return Response('Error: Wrong API Key!', status=401)
    print ("point a")
    script=dict()
    script['title']=request.form['title']
    script['content']=request.form['content']
    script['tags']=request.form.getlist('tags')
    print ("point b" + json.dumps(script))
    resp = insert_new_script(script)
    return resp

# end post new script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# delete script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

@GFServer.route('/v1/script', methods=['DELETE'])
def deleteScript():
    """ Purpose:
        Deletes script given a ticket.
        The ticket is internally tied to the script ID.
        This will allow script-writers to "edit" or delete their script.

        Parameter:
        ticket, a string list

        Returns:
        On success, 200 error
        On failure, 400 error

        Useful Source:
        http://www.mysqltutorial.org/python-mysql-delete-data/
    """
    # not touching tags table
    # connection to database
    key = request.headers.get('APIKey')
    if (key != APIkey):
        return Response('Error: Wrong API Key!', status=401)
    ticket=request.args['ticket']
    ticket=ticket.replace(" ","+")
    cnx = MySQLdb.connect(host = DBIP, user = DBUser, passwd = DBPasswd, db = DBName)
    cursor = cnx.cursor()
    print("ticketttttttt"+ticket)
    command="SELECT EXISTS(SELECT title FROM call_scripts WHERE ticket=%s)"
    cursor.execute(command,(ticket,))
    result=cursor.fetchone()[0]
    print("resultttttt"+str(result))
    if result==0:
        resp = Response("{'Status':'No such ticket'}", status=404, mimetype='application/json')
        return resp
    # try to delete call script based on ticket number parameter
    try:
        print("start delete script")
        query = "SELECT unique_id FROM call_scripts WHERE ticket = %s"
        print(query)
        cursor.execute(query,(ticket,))
        id=cursor.fetchone()[0]
        print("idddddddddd"+str(id))
        query = "DELETE FROM link_callscripts_tags WHERE call_script_id = %s"
        print(query)
        cursor.execute(query,(id,))
        query = "DELETE FROM call_scripts WHERE ticket = %s"
        print(query)
        cursor.execute(query,(ticket,))
        success_resp = Response("{'Status':'OK'}", status=200, mimetype='application/json')
        cnx.commit()
        cnx.close()
        return success_resp
    except:
        failure_resp = Response("{'Status':'Deletion Failed'}", status=404, mimetype='application/json')
        cnx.close()
        return failure_resp


# end delete script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# alltags~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

TagNames = dict()
TagIDs = dict()

def init_tagnames():
    """
		Purpose:
        Read in the tags table and cache it into memory
        Returns:
        Void
    """
    # establish database connection
    cnx = MySQLdb.connect(host = DBIP, user = DBUser, passwd = DBPasswd, db = DBName)
    cursor = cnx.cursor()
    # execute SQL
    cursor.execute("SELECT tag_name, unique_id FROM tags")
    thetags = cursor.fetchall()
    # store table in a variable
    # store tag_names and id's into two dictionaries
    for row in thetags:
        TagIDs[row[0]] = row[1]
        TagNames[row[1]] = row[0]

#automatically load all tags when application start
init_tagnames()
print(str(TagNames))
print(str(TagIDs))

@GFServer.route('/v1/alltags', methods = ['GET'])
def getAllTags():
    key = request.headers.get('APIKey')
    if (key != APIkey):
        return Response('Error: Wrong API Key!', status=401)

    return Response (json.dumps(TagNames), status=200, mimetype='application/json')

# end alltags~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


# get id and script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


@GFServer.route('/v1/id', methods=['GET'])
def getID():
    """ Purpose:
        Given a ticket, find and return the script id
    """
    key = request.headers.get('APIKey')
    if (key != APIkey):
        return Response('Error: Wrong API Key!', status=401)

    ticket = request.args['ticket']
    ticket=ticket.replace(" ","+")
    cnx = MySQLdb.connect(host = DBIP, user = DBUser, passwd = DBPasswd, db = DBName)
    cursor = cnx.cursor()
    command="SELECT EXISTS(SELECT title FROM call_scripts WHERE ticket=%s)"
    cursor.execute(command,(ticket,))
    result=cursor.fetchone()[0]
    if result==0:
        resp = Response("{'Status':'No such ticket'}", status=404, mimetype='application/json')
        return resp
    try:
        command = "SELECT unique_id FROM call_scripts WHERE ticket = %s"
        print(command)
        cursor.execute(command,(ticket,))
        print("finish getting id")
        row = cursor.fetchone()
        id = row[0]
        resp = Response("{'Status':'OK','id':"+str(id)+"}", status=200, mimetype='application/json')
        return resp
    except:
        resp = Response("{'Status':'Failed to get id'}", status=404, mimetype='application/json')
        return resp



@GFServer.route('/v1/script', methods=['GET'])
def getScript():
    """ Purpose:
        Given a id, find and return the script
    """
    key = request.headers.get('APIKey')
    if (key != APIkey):
        return Response('Error: Wrong API Key!', status=401)

    id = request.args['id']
    cnx = MySQLdb.connect(host = DBIP, user = DBUser, passwd = DBPasswd, db = DBName)
    cursor = cnx.cursor()
    try:
        command="SELECT title,content FROM call_scripts WHERE unique_id = %s"
        cursor.execute(command,(id,));
        row = cursor.fetchone()
        script=dict()
        script['title'] = row[0]
        script['content'] = row[1]
        script['tags'] = list()
        command="SELECT tag_id FROM link_callscripts_tags WHERE call_script_id = %s"
        cursor.execute(command,(id,));
        rows = cursor.fetchall()
        for row in rows:
            tag_id=row[0]
            script['tags'].append(tag_id)
        result = dict()
        result['Status']='OK'
        result['Script']=script
        js=json.dumps(result)
        resp = Response(js, status=200, mimetype='application/json')
        cursor.close()
        cnx.close()
        return resp
    except:
        resp = Response("{'Status':'Failed to get script'}", status=404, mimetype='application/json')
        return resp


# end get id and script~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

if __name__ == "__main__":
    GFServer.run()
