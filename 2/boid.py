from vec2d import Vec2d

class Boid:
    MAX_FORCE = 2.4
    MAX_VELOCITY = 3

    def __init__(self, x, y, totalMass = 20):
        self.position = Vec2d(x, y)
        self.velocity = Vec2d(-1, -2)
        self.target   = Vec2d(310, 240)
        self.desired  = Vec2d(0, 0)
        self.steering = Vec2d(0, 0)
        self.mass     = totalMass

        self.truncate(self.velocity, self.MAX_VELOCITY)

    def seek(self, target):
        desired = target - self.position
        desired = desired.normalized()
        desired *= self.MAX_VELOCITY

        return desired - self.velocity

    def truncate(self, vector, max):
        i = max / vector.get_length()
        i = 1.0 if i < 1.0 else i

        vector *= i

    def update(self):
        steering = self.seek(self.target)

        self.truncate(steering, self.MAX_FORCE)
        steering *= (1 / self.mass)

        self.velocity += steering
        self.truncate(self.velocity, self.MAX_VELOCITY)

        self.position += self.velocity

