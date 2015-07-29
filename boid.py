import math, random

from vec2d import Vec2d

class Boid:

    def __init__(self, game, x, y):
        self.game = game
        self.x = x
        self.y = y
        velocityX = random.randint(1, 10) / 10.0
        velocityY = random.randint(1, 10) / 10.0
        self.vector = Vec2d(velocityX, velocityY)

    def moveAway(self, boids, minDistance):
        if len(boids) < 1: return

        distanceX = 0
        distanceY = 0
        numClose  = 0

        for boid in boids:
            distance = self.distance(boid)
            if distance < minDistance:
                numClose += 1
                xDiff = (self.x - boid.x)
                yDiff = (self.y - boid.y)

                if xDiff >= 0:
                    xDiff = math.sqrt(minDistance) - xDiff
                elif xDiff < 0:
                    xDiff = -math.sqrt(minDistance) - xDiff

                distanceX += xDiff
                distanceY += yDiff

            if numClose == 0:
                return

            self.vector.x -= distanceX / 5
            self.vector.y -= distanceY / 5

    def move(self):
        if abs(self.vector.x) > self.game.maxVelocity or abs(self.vector.y) > self.game.maxVelocity:
            scaleFactor = self.game.maxVelocity / max(abs(self.vector.x), abs(self.vector.y))
            self.vector.x *= scaleFactor
            self.vector.y *= scaleFactor

        self.x += self.vector.x
        self.y += self.vector.y

    def distance(self, boid):
        distX = self.x - boid.x
        distY = self.y - boid.y
        return math.sqrt(distX * distX + distY * distY)




