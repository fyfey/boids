import pygame, random, sys, math, decimal
from pygame.locals import *
from boid import Boid
pygame.init()

FPS = 1000
DKGREY = (50,50,50)
MAX_VELOCITY = 10
NUM_BOIDS = 50
MAX_VELOCITY = 100
SCREENHEIGHT = 800
SCREENWIDTH  = 600

class Game():

    def __init__(self):
        # self.font = pygame.font.SysFont('arial',10)
        self.fpsClock = pygame.time.Clock()
        self.fps = FPS
        self.boids = []
        self.maxVelocity = MAX_VELOCITY

        self.sprite = pygame.image.load("boid.png")
        self.spriteRect = self.sprite.get_rect()

    def start(self):
        print 'starting game loop'

        self.SCREENWIDTH, self.SCREENHEIGHT = (SCREENWIDTH, SCREENWIDTH)
        self.surface = pygame.display.set_mode((self.SCREENWIDTH, self.SCREENHEIGHT))
        pygame.display.set_caption('Boids')
        self.surface.fill(DKGREY)

        for i in range(NUM_BOIDS):
            self.boids.append(Boid(self, random.randint(0, self.SCREENWIDTH), random.randint(0, self.SCREENHEIGHT)))

        while True:
            for event in pygame.event.get(QUIT): # get all the QUIT events
                print 'quit'
                pygame.quit()
                sys.exit()
            for event in pygame.event.get():
                if event.type == pygame.MOUSEBUTTONUP:
                    pass
                if event.type == pygame.KEYUP:
                    pass

            for boid in self.boids:
                closeBoids = []
                for otherBoid in self.boids:
                    if otherBoid == boid:
                        continue
                    distance = boid.distance(otherBoid)
                    if distance < 200:
                        closeBoids.append(otherBoid)

                self.updateBoid(boid, closeBoids)

            pygame.display.flip()
            self.fpsClock.tick(self.fps)

    def updateBoid(self, boid, closeBoids):

        boid.moveAway(closeBoids, 20)

        border = 25
        if boid.x < border and boid.vector.x < 0:
            boid.vector.x = -boid.vector.x * random.random()
        if boid.x > self.SCREENWIDTH - border and boid.vector.x > 0:
            boid.vector.x = -boid.vector.x * random.random()
        if boid.y < border and boid.vector.y < 0:
            boid.vector.y = -boid.vector.y * random.random()
        if boid.y > self.SCREENHEIGHT - border and boid.vector.y > 0:
            boid.vector.y = -boid.vector.y * random.random()

        boid.move()

        " Draw boids "
        self.surface.fill(DKGREY)
        for boid in self.boids:
            boidRect = pygame.Rect(self.spriteRect)
            boidRect.x = boid.x
            boidRect.y = boid.y
            sprite = pygame.transform.rotate(self.sprite, (-boid.vector.get_angle()) + 90)
            self.surface.blit(sprite, boidRect)


def main():
    game = Game()
    game.start()

if __name__ == '__main__':
    main()
