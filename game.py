import pygame, random, sys, math, decimal
from pygame.locals import *
from boid import Boid
from vec2d import Vec2d
pygame.init()

FPS = 10
DKGREY = (50,50,50)
NUM_BOIDS = 1
SCREENHEIGHT = 800
SCREENWIDTH  = 600

class Game():

    def __init__(self):
        # self.font = pygame.font.SysFont('arial',10)
        self.fpsClock = pygame.time.Clock()
        self.fps = FPS
        self.boids = []

        self.target = Vec2d(random.randint(1, SCREENWIDTH), random.randint(1, SCREENHEIGHT))
        print 'target %s' % self.target

        self.sprite = pygame.image.load("sprite.png")
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

            self.drawTarget()

            pygame.display.flip()
            self.fpsClock.tick(self.fps)

    def updateBoid(self, boid, closeBoids):

        # boid.moveAway(closeBoids, DISTANCE)

        # border = 25
        # if boid.x < border and boid.vector.x < 0:
        #     boid.vector.x = -boid.vector.x * random.random()
        # if boid.x > self.SCREENWIDTH - border and boid.vector.x > 0:
        #     boid.vector.x = -boid.vector.x * random.random()
        # if boid.y < border and boid.vector.y < 0:
        #     boid.vector.y = -boid.vector.y * random.random()
        # if boid.y > self.SCREENHEIGHT - border and boid.vector.y > 0:
        #     boid.vector.y = -boid.vector.y * random.random()

        boid.move()

        " Draw boids "
        self.surface.fill(DKGREY)
        for boid in self.boids:
            boidRect = pygame.Rect(self.spriteRect)
            print 'Position %s' % boid.position
            boidRect.x = boid.position.x
            boidRect.y = boid.position.y
            sprite = pygame.transform.rotate(self.sprite, (-boid.velocity.get_angle()) + 90)
            self.surface.blit(sprite, boidRect)

    def drawTarget(self):

        pygame.draw.circle(self.surface, (255, 0, 0), (self.target.x, self.target.y), 10, 1)


def main():
    game = Game()
    game.start()

if __name__ == '__main__':
    main()
