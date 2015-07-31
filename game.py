import pygame, random, sys, math, decimal
from pygame.locals import *
from boid import Boid
from vec2d import Vec2d
pygame.init()

FPS = 30
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

        self.sprite = pygame.image.load("sprite.png")
        self.spriteRect = self.sprite.get_rect()

    def start(self):
        print 'starting game loop'

        self.SCREENWIDTH, self.SCREENHEIGHT = (SCREENWIDTH, SCREENWIDTH)
        self.surface = pygame.display.set_mode((self.SCREENWIDTH, self.SCREENHEIGHT))
        pygame.display.set_caption('Boids')
        self.surface.fill(DKGREY)

        for i in range(NUM_BOIDS):
            self.boids.append(Boid(random.randint(0, self.SCREENWIDTH), random.randint(0, self.SCREENHEIGHT), self.target))

        while True:
            for event in pygame.event.get(QUIT): # get all the QUIT events
                pygame.quit()
                sys.exit()
            for event in pygame.event.get():
                if event.type == pygame.MOUSEBUTTONUP:
                    (self.target.x, self.target.y) = pygame.mouse.get_pos()
                if event.type == pygame.KEYUP:
                    if event.key == K_1:
                        for boid in self.boids:
                            boid.state = "seek"
                    if event.key == K_2:
                        for boid in self.boids:
                            boid.state = "flee"

            for boid in self.boids:
                # closeBoids = []
                # for otherBoid in self.boids:
                #     if otherBoid == boid:
                #         continue
                #     distance = boid.distance(otherBoid)
                #     if distance < 200:
                #         closeBoids.append(otherBoid)

                self.updateBoid(boid)

            pygame.display.flip()
            self.fpsClock.tick(self.fps)

    def updateBoid(self, boid):

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

        boid.update()

        " Draw boids "
        self.surface.fill(DKGREY)
        for boid in self.boids:
            boidRect = pygame.Rect(self.spriteRect)
            boidRect.center = boid.position;
            sprite, rect = self.rot_center(self.sprite, boidRect, (-boid.velocity.get_angle()) + 90)
            self.surface.blit(sprite, rect)

            self.drawForces(boid)

            pygame.draw.circle(self.surface, (255, 0, 0), boid.target, 5, 1)

    def rot_center(self, image, rect, angle):
        rot_image = pygame.transform.rotate(image, angle)
        rot_rect = rot_image.get_rect(center=rect.center)
        return rot_image, rot_rect

    def drawForces(self, boid):
        velocity = Vec2d(boid.velocity)
        desired  = Vec2d(boid.desired)
        steering = Vec2d(boid.steering)

        velocity.normalized();
        desired.normalized();
        steering.normalized();

        self.drawForceVector(boid, velocity, (0, 255, 0))
        self.drawForceVector(boid, desired, (0, 0, 255))
        self.drawForceVector(boid, steering, (255, 0, 0))

    def drawForceVector(self, boid, vector, color):
        scale = 100
        pygame.draw.line(self.surface, color, (boid.position.x + 10 / 2, boid.position.y + 25 / 2), (boid.position.x + vector.x * scale, boid.position.y + vector.y * scale))
        pygame


def main():
    game = Game()
    game.start()

if __name__ == '__main__':
    main()
