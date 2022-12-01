import os
mostCalories = [-1, -1, -1]
countCalories = 0


with open(os.path.join(os.getcwd(), 'input'), 'r') as input:
  for line in input:
    if line != '\n':
      countCalories += int(line)
    else:
      if countCalories > mostCalories[0]:
        mostCalories[0] = countCalories
        mostCalories.sort()
      countCalories = 0
        
print(sum(mostCalories))