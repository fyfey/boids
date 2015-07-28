import math, random

class Boid

    def __init__(self, game, x, y):
        self.game = game
        self.x = x
        self.y = y
        self.velocityX = randon.randint(1, 10) / 10.0
        self.velocityY = randon.randint(1, 10) / 10.0

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

                if xdiff >= 0:
                    xdiff = math.sqrt(minDistance) - xdiff
                elif xdiff < 0:
                    xdiff = -math.sqrt(minDistance) - xdiff

                distanceX += xDiff
                distanceY += yDiff

            if numClose === 0:
                return

            self.velocityX -= distanceX / 5
            self.velocityY -= distanceY / 5

    def move(self):
        if abs(self.velocityX) > self.game.maxVelocity or abs(self.velocityY) > maxVelocity:
            scaleFactory = maxVelocity / max(abs(self.velocityX), abs(self.velocityY))
            self.velocityX *= scaleFactor
            self.velocityY *= scaleFactor

        self.x += self.velocityX
        self.y += self.velocityY



