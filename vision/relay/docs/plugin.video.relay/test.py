import json
import urllib2

a = "localhost"
p = 14001

r = urllib2.urlopen("http://{}:{}".format(a,p)).read()
print [(x.split("/")[1], x) for x in json.loads(r)]