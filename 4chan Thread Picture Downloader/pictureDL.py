import urllib2
import urllib
import urlparse
import os
import sys
import threading

search = raw_input("What search? ")
many = raw_input("how many pictures? ")

if many == "0":
    many = 1000

url = search

dire = search[search.find("res") + 4:]

headers = {"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)"}

req = urllib2.Request(url, None, headers)
code = urllib2.urlopen(req).read()


class MyThread ( threading.Thread ):
    def searcher(self, c, i, end):
        
        start = c.find("images.4chan.org")
        finish = start + c[start:].find(".jpg")+4
        
        
        
        if ((finish - start) > 60):
            
            finish = start + c[start:].find(".png")+4

        if ((finish - start) > 60):
            finish = start + c[start:].find(".gif")+4
        if ((finish - start)> 60):
            finish = start + c[start:].find(".jpeg")+5
        
        link = c[start:finish]
        
        name =  link[link.find("src")+3:]
        
        
        parsed = list(urlparse.urlparse("http://" + link))
        word=search;
        
        if not os.path.exists("C:/4chanpics/" + dire + "/"):
            os.makedirs("C:/4chanpics/" + dire + "/")
        outpath = os.path.join("C:/4chanpics/" + dire + "/" + name)
        
        
        
        urllib.urlretrieve(urlparse.urlunparse(parsed), outpath)
        
        if (c[finish:].find("images.4chan.org") > 0):
            if (i < end):
                MyThread().start()
                MyThread().searcher(c[finish + c[finish:].find("table"):], i+1, end)              

    

    

MyThread().start()
MyThread().searcher(code, 0, int(many))