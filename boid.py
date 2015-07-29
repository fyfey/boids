import math, random, copy

from vec2d import Vec2d

CIRCLE_DISTANCE = 30
CIRCLE_RADIUS = 50
ANGLE_CHANGE = 10
MAX_VELOCITY = 100
MAX_SPEED = 10
MAX_FORCE = 10
MASS = 50

def truncate(n, max):
    if isinstance(n, Vec2d):
        return Vec2d(truncate(n.x, max), truncate(n.y, max))
    if (n > max):
        return max
    return n

class Boid:

    def __init__(self, game, x, y):

        self.game = game

        self.food = 100

        self.position = Vec2d(x, y)

        velocityX = random.randint(-10, 10)
        velocityY = random.randint(-10, 10)
        self.velocity = Vec2d(velocityX, velocityY)

        self.wanderAngle = 0;

    def wander(self):
        circleCenter = copy.copy(self.velocity)
        circleCenter.normalized()
        circleCenter = circleCenter * CIRCLE_DISTANCE

        print 'circleCenter %s' % circleCenter

        displacement = Vec2d(0, -1)
        displacement = displacement * CIRCLE_RADIUS
        displacement.rotate(self.wanderAngle)

        print 'displacement %s' % displacement

        self.wanderAngle += ((random.randint(1, 10) / 10.0) * ANGLE_CHANGE) - (ANGLE_CHANGE * 0.5);

        wanderForce = circleCenter + displacement

        return wanderForce

    def seek(self):

        desiredVelocity = self.game.target - self.position
        desiredVelocity = desiredVelocity.normalized() * MAX_VELOCITY
        desiredVelocity = desiredVelocity - self.velocity

        print "desiredVelocity %s" % desiredVelocity

        return desiredVelocity

    # def moveAway(self, boids, minDistance):
    #     if len(boids) < 1: return

    #     distanceX = 0
    #     distanceY = 0
    #     numClose  = 0

    #     for boid in boids:
    #         distance = self.distance(boid)
    #         print distance
    #         if distance < minDistance:
    #             numClose += 1
    #             xDiff = (self.x - boid.x)
    #             yDiff = (self.y - boid.y)

    #             if xDiff >= 0:
    #                 xDiff = math.sqrt(minDistance) - xDiff
    #             elif xDiff < 0:
    #                 xDiff = -math.sqrt(minDistance) - xDiff

    #             distanceX += xDiff
    #             distanceY += yDiff

    #         if numClose == 0:
    #             return

    #         selocityector.x -= distanceX / 20
    #         self.vector.y -= distanceY / 20

    # def move(self):
    #     if abs(self.vector.x) > self.game.maxVelocity or abs(self.vector.y) > self.game.maxVelocity:
    #         scaleFactor = self.game.maxVelocity / max(abs(self.vector.x), abs(self.vector.y))
    #         self.vector.x *= scaleFactor
    #         self.vector.y *= scaleFactor

    #     self.x += self.vector.x
    #     self.y += self.vector.y

    #     self.food -= 0.1
    #     print self.food
    def move(self):

        steering = self.seek() - self.velocity

        steering = truncate(steering, MAX_FORCE)
        steering = steering / MASS

        # self.velocity = truncate(self.velocity + steering, MAX_SPEED)
        self.position = self.position + self.velocity

    def distance(self, boid):
        distX = self.x - boid.x
        distY = self.y - boid.y
        return math.sqrt(distX * distX + distY * distY)
