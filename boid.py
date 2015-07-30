import random
from vec2d import Vec2d

class Boid:
    MAX_FORCE    = 1.2
    MAX_SPEED    = 2
    MAX_VELOCITY = 3

    def __init__(self, x, y, target, totalMass = 20):
        self.position = Vec2d(x, y)
        self.velocity = Vec2d(-1, -2)
        self.desired  = Vec2d(0, 0)
        self.steering = Vec2d(0, 0)
        self.target   = target
        self.mass     = totalMass
        self.state    = 'seek'
        self.states   = ['seek', 'flee']

        self.truncate(self.velocity, self.MAX_VELOCITY)

    def randomState(self):
        self.state = random.choice(self.states);

    def seek(self, target):
        desired = target - self.position
        desired = desired.normalized()
        desired *= self.MAX_VELOCITY
        desired -= self.velocity

        return desired

    def flee(self, target):
        desired = self.position - target
        desired = desired.normalized()
        desired *= self.MAX_VELOCITY
        desired -= self.velocity

        return desired

    def truncate(self, vector, max):
        i = max / vector.get_length()
        i = 1.0 if i < 1.0 else i

        vector *= i

    def update(self):
        if self.state == 'seek':
            self.steering = self.seek(self.target)
        if self.state == 'flee':
            self.steering = self.flee(self.target)

        self.truncate(self.steering, self.MAX_FORCE)
        self.steering /= self.mass

        self.velocity = self.velocity + self.steering
        self.truncate(self.velocity, self.MAX_SPEED)
        self.position = self.position + self.velocity

