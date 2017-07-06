
import pygame
from array import *
from pygame.locals import *
pygame.init()
f = file("deaths.txt","r")
deaths = f.readlines()
f.close()
for i in range(0,10):
    deaths[i] = int(deaths[i].strip())
msgs = [None]*10
sel = 0

screen = pygame.display.set_mode((310, 260))
running = True
 
#bg = pygame.image.load("C:/lol/happy.png")
clock = pygame.time.Clock()
 
myFont = pygame.font.SysFont("Arial", 18)
 
while running==True:
    
    
    screen.fill((255,255,255))
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            File = open("deaths.txt","w")
            for i in range(0,10):
                File.write(str(deaths[i]) + "\n")
            File.close()
            running=False        
        if (event.type == KEYDOWN):
            if (event.key == K_RIGHT):
                deaths[sel]+=1 
            elif (event.key == K_LEFT):
                if (deaths[sel] > 0):
                    deaths[sel]-=1            
            elif (event.key == K_UP):
                if (sel > 0):
                    sel-=1 
            elif (event.key == K_DOWN):
                if (sel < 9):
                    sel+=1  
    
    
 
    #screen.blit((bg),(0,0))
    #pygame.draw.rect(screen, (255,255,255), (0, 500, 640,100), 0)
    color = (0,0,0)
    for i in range(0,10):
        if (sel == i):
            color = (255,0,0)
        if (i==0):
            msgs[0] = myFont.render("Siberia",True,color)
        if (i==1):
            msgs[1] = myFont.render("Chicago",True,color)
        if (i==2):
            msgs[2] = myFont.render("Notre Dame",True,color)
        if (i==3):
            msgs[3] = myFont.render("Planet X",True,color)
        if (i==4):
            msgs[4] = myFont.render("NeoTokyo",True,color)
        if (i==5):
            msgs[5] = myFont.render("Wild West",True,color)
        if (i==6):
            msgs[6] = myFont.render("Atom Smasher",True,color)
        if (i==7):
            msgs[7] = myFont.render("Aztec Ruins",True,color)
        if (i==8):
            msgs[8] = myFont.render("Robot Factory",True,color)
        if (i==9):
            msgs[9] = myFont.render("Space Station",True,color)
        color = (0,0,0)
    dMsg = myFont.render("Deaths/Resets",True,(0,0,0))
    lMsg = myFont.render("Level",True,(0,0,0))

    for i in range(0,10):
        if (i==sel):
            color = (255,0,0)
        else:
            color = (0,0,0)
        screen.blit(myFont.render(str(deaths[i]),True,color),(235,35+i*21))
        screen.blit(msgs[i],(10,35+i*21))
    screen.blit(lMsg,(10,5)) 
    screen.blit(dMsg,(185,5))
    pygame.display.update()
    clock.tick(40)
 
pygame.quit()
