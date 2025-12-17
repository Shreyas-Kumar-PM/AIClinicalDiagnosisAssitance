import pandas as pd
import random

data = []

for _ in range(5000):
    temp = round(random.uniform(35.5, 41.0), 1)
    hr = random.randint(40, 160)
    bp_sys = random.randint(90, 200)
    spo2 = random.randint(75, 100)

    high_risk = int(
        temp > 38.5 or
        hr > 120 or
        bp_sys > 160 or
        spo2 < 90
    )

    data.append([temp, hr, bp_sys, spo2, high_risk])

df = pd.DataFrame(
    data,
    columns=["temp", "hr", "bp_sys", "spo2", "high_risk"]
)

df.to_csv("data/vitals/vitals.csv", index=False)
