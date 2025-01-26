# [Monte Carlo Pi](https://montecarlopi.vercel.app/)
<a href="https://github.com/TetieWasTaken/monte-carlo-pi/blob/main/LICENSE"><img src="https://img.shields.io/github/license/TetieWasTaken/monte-carlo-pi" alt="license"/></a>
<a href="https://montecarlopi.vercel.app/"><img src="https://img.shields.io/website?url=https%3A%2F%2Fmontecarlopi.vercel.app%2F" alt="repo size"/></a>

Approximate π using the [Monte Carlo method](https://en.wikipedia.org/wiki/Monte_Carlo_method). Check out the live site [**here**](https://montecarlopi.vercel.app/). Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) and hosted on [Vercel](https://vercel.com/).

<a href="https://montecarlopi.vercel.app/"><img src="/images/matrix.gif" alt="matrix gif" width="200"/></a>

## About
> This tool approximates π using the Monte Carlo method. The Monte Carlo method is a statistical method that uses random sampling to estimate numerical results. In this simulation, a circle is inscribed in a quadrant. The ratio between the area of the circle and the area of the square is π/4. By randomly selecting points in the quadrant, the ratio of points inside the circle to the total number of points is used to approximate π.
###### From [montecarlopi.vercel.app](https://montecarlopi.vercel.app/)

## Usage
> 1. Enter the number of points to generate using the input field.
> 2. (optional) Select the simulation mode.
>    - Simulate: generate points one by one
>    - Instant: generate everything at once
>    - Automatic: choose for me
> 3. Click the Start button to start the simulation.
###### From [montecarlopi.vercel.app](https://montecarlopi.vercel.app/)

## Features
- Approximate π using the Monte Carlo method
- Customise the number of points to generate
- Choose between three simulation modes
- Allows for high point counts without lag
- Responsive design (works on all devices)

![primary](/images/primary.gif)

## Local Development
1. Clone the repository
```bash
gh repo clone TetieWasTaken/monte-carlo-pi # using GitHub CLI
git clone https://github.com/TetieWasTaken/monte-carlo-pi.git # using Git
```

2. Install the dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Legal & Disclaimer
This tool is provided as is without any guarantees or warranty. Use of the product by a user is at the user’s risk. This project is licensed under the MIT License. For more information, see the [LICENSE](https://github.com/TetieWasTaken/monte-carlo-pi/blob/main/LICENSE) file. AI has been used for reviewing and improving the codebase.