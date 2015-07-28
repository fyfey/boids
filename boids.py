import pygame, random, sys, math, decimal
from pygame.locals import *
from boid import Boid
pygame.init()

DKGREY = (50,50,50)
MAX_VELOCITY = 10
NUM_BOIDS = 50
boids = []

class Game():

    def __init__(self):
        # self.font = pygame.font.SysFont('arial',10)
        self.fpsClock = pygame.time.Clock()
        self.fps = 30

    def start(self):
        print 'starting game loop'

        self.SCREENWIDTH, self.SCREENHEIGHT = (800, 600)
        self.surface = pygame.display.set_mode((self.SCREENWIDTH, self.SCREENHEIGHT))
        pygame.display.set_caption('Boids')
        self.surface.fill(DKGREY)

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

            self.updateBoids()

            pygame.display.flip()
            self.fpsClock.tick(self.fps)

    def updateBoids(self):
        boid,moveAway(boids, 20)
        boid.move


def main():
    game = Game()
    game.start()

if __name__ == '__main__':
    main()
