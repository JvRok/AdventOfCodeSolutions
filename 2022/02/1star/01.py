import os
score = 0

rps = {
  "A": 1,
  "B": 2,
  "C": 3,
  "X": 1,
  "Y": 2,
  "Z": 3
}
#Idea here is to use modulus to wrap around, and add 3 to keep base same but positive.
#With this calculation, the draw is awlays 0, win is always 1.
with open(os.path.join(os.getcwd(), 'input'), 'r') as input:
  for line in input:
    if line != '\n':
      score += rps[line[2]]
      match (rps[line[2]] - rps[line[0]] + 3) % 3:
        case 0:
          score += 3
        case 1:
          score += 6
print(score)