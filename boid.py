import random
from vec2d import Vec2d

MASS           = 20
MAX_FORCE      = 2
MAX_SPEED      = 3
SLOWING_RADIUS = 150

class Boid:

    def __init__(self, x, y, target, totalMass = 20):
        self.position = Vec2d(x, y)
        self.velocity = Vec2d(-1, -2)

        self.desired  = Vec2d(0, 0)
        self.steering = Vec2d(0, 0)
        self.target   = target

        self.velocity = self.velocity.truncate(MAX_SPEED)

    def seek(self, target):

        target_offset = target - self.position
        distance = target_offset.get_length()

        ramped_speed = MAX_SPEED * (distance / SLOWING_RADIUS)
        clipped_speed = min([ramped_speed, MAX_SPEED])
        desired = (clipped_speed / distance) * target_offset

        return desired - self.velocity

    def flee(self, target):
        desired = (self.position - target).normalized() * MAX_SPEED

        return desired - self.velocity

    def update(self):
        self.steering = self.seek(self.target)

        steering_force = self.steering.truncate(MAX_FORCE)
        acceleration = steering_force / MASS

        self.velocity = (self.velocity + acceleration).truncate(MAX_SPEED)
        self.position = self.position + self.velocity

