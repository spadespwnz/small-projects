import ConfigParser
import string
import socket
import time

import threading

from threading import Thread

import pygame
from array import *
from pygame.locals import *
pygame.init()

clock = pygame.time.Clock()
screen = pygame.display.set_mode((370, 230))

myFont = pygame.font.SysFont("Arial", 12)
#switching off promiscuous mode
#msgbox("Admitting to Accesss Network Traffic Log", "Testing Demo")
print "Click enter to Sniff around"
raw_input()
conf = ConfigParser.ConfigParser()
conf.sniff_promisc=False
print "IP address: " + socket.gethostbyname(socket.gethostname())
s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)
print "Hosename: " + socket.gethostname()
# the public network interface
HOST = socket.gethostbyname(socket.gethostname())
# create a raw socket and bind it to the public interface
s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)
s.bind((HOST, 0))
#Dobule check for promisuouse mode
s.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)
# Include IP headers
s.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
# receive all packages
s.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)
# receive a package
#The moment the packet is grab, create a time stamp
times = time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime())
i = 0
running = True
reading = False
unfiltered = []
filtered = []
#s.settimeout(1)
s.setblocking(0)
print "At: " + times

class MyThread(threading.Thread):
    
    def readData(self):
        global reading
        global i
        reading = True
        dataStr = ''
        start = -1
        end = -1
        #time.sleep(1)

        while reading == True:
            try:
                data = s.recvfrom(4096)
            except:
                reading = False
                break
            if data == '':
                break;
            dataStr = str(data)
            print dataStr
            if dataStr.find("spades@ldkywd.com") != -1 and dataStr.find("Message-Type: Text") != -1:
                #print dataStr
                msgFrom = dataStr[dataStr.find("From:")+8: dataStr.find("From:")+8+dataStr[dataStr.find("From:")+8:].find("@")]
                msgTo = dataStr[dataStr.find("To:")+6: dataStr.find("To:")+6+dataStr[dataStr.find("To:")+6:].find("@")]
                if dataStr.find("RL=") != -1:
                    start = dataStr.find("RL=")+12   
                    if dataStr[start:start+dataStr[start:].find(", (")+3].find("',") != -1:
                        end = dataStr.find("RL=")+12+dataStr[dataStr.find("RL=")+12:].find("',")
                    else:
                        end = dataStr.find("RL=")+12+dataStr[dataStr.find("RL=")+12:].find('",')
                 
                elif dataStr.find("PF=") != -1:
                    start = dataStr.find("PF=")+12
                    
                    if dataStr[start:start+dataStr[start:].find(", (")+3].find("',") != -1:
                        end = dataStr.find("PF=")+12+dataStr[dataStr.find("PF=")+12:].find("',")
                    else:
                        end = dataStr.find("PF=")+12+dataStr[dataStr.find("PF=")+12:].find('",')
                elif dataStr.find("CO=") != -1:
                    start = dataStr.find("CO=")+12
                    
                    if dataStr[start:start+dataStr[start:].find(", (")+3].find("',") != -1:
                        end = dataStr.find("CO=")+12+dataStr[dataStr.find("CO=")+12:].find("',")
                    else:
                        end = dataStr.find("CO=")+12+dataStr[dataStr.find("CO=")+12:].find('",')                
                finalData = dataStr[start:end]
                finalData = finalData.replace("\\r\\n", "")
                finalData = [finalData[i:i+50] for i in range(0, len(finalData), 50)]
                
                #finalData = [''.join(x) for x in zip(*[list(finalData[z::50]) for z in range(50)])]
                
                filtered.append(msgFrom+" -> " + msgTo + ": " + finalData[0])
               
                for i in range (1,len(finalData)):
                    filtered.append(finalData[i])
    
            reading = False

        
class MyOtherThread(threading.Thread):
    def display(self):
        scroll = 0
        up = 0
        global running;
        global i
        while running == True:
            
            screen.fill((255,255,255))
            
            for event in pygame.event.get():
               
                if event.type == pygame.MOUSEBUTTONDOWN and event.button == 4:
                    
                    up = up - 1
                elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 5:
                    if up < 0:
                        up = up + 1 
                if event.type == pygame.QUIT:
                    running=False    
                    i = 100;
                
            scroll = (len(filtered)+up)*21
            for j in range(0,len(filtered)):
                if scroll < 210:
                    screen.blit(myFont.render(str(filtered[j]),True,(0,0,0)),(5,10+j*21))
                else:
                    screen.blit(myFont.render(str(filtered[j]),True,(0,0,0)),(5,10+j*21-(scroll-210)))
            
            
            if reading == False:
                
                MyThread().readData()
            pygame.display.update()
            #clock.tick(40)            
MyThread().start()
MyOtherThread().start()
MyOtherThread().display()

pygame.quit()
