import os
mostCalories = -1
countCalories = 0

with open(os.path.join(os.getcwd(), 'input'), 'r') as input:
  for line in input:
    if line != '\n':
      countCalories += int(line)
    else:
      if countCalories > mostCalories:
        mostCalories = countCalories
      countCalories = 0
        
print(mostCalories)