# Application Prompts

This file catalogs the prompts used to generate the application.

## 1. Initial Component Structure

> I want to build a simple app that displays results for baseball games in the dashboard.tsx route.  
>
> Let's start by building the simple components that will make up the root of the dashboard.
>
> 1. Team
> A team always has a  Name and optionally has an indicator if they are the home team (isHome) that is a boolean, or could be undefined.  A team also has an active player which consists of a label and a playerName
>
> 2. Game Status
> A game status always has a location and it always has a scenario.  A scenario can be one of several things: a time, a string, or a current status.
>
> A current status consists of  inningNumber, inningSide {top or bottom}, outs, and basesImage
>
> This should be implemented as a Stack component with the location on the bottom.
>
> 3.GameNotification
> The game notification will be comprised of three parts: MarlinsAffiliate (a Team Component), Opponent (Team Component) and GameStatus 
>
> The GameNotificaiton should be a 3 column Grid spread evenly across the three components
>
> 4. Schedule and Results
> This is the over arching component for the dashboard page.  It's a stack consisting of three main parts:
> Heading:  Schedule and Results
> Form:  Current date selected, date picker
> ScheduleList:  An array of GameNotifications organized in a single column Grid

## 2. Component Props Convention

> I want the Component Props to be defined in the same file as the component with the format [ComponentName]Props

## 3. Refactor GameNotification Props (Aborted)

> GameNotification interface should be MOVED to be the props of the GameNotificaiton componentn

## 4. Revert Refactor

> Go back one iteration and build the component

## 5. Switch to Material-UI

> We should be using MaterialUI components, not inline styles.  Fix the Team component as well

## 6. Create Prompt Catalog

> Create, and update as we go, a markdown file prompts, cataloging the prompts used to generate the application

## 7. Fetch Schedule Data with React Query

> Next is utilizing react query to dynamically fetch the data we need.  As a rule I want to manipulate the data before returning it to the component using the useQuery's "select" attribute to process the data.  For the purposes of this application we can avoid the overhead of axios and just use the fetch interface.  The goal in the manipulation is to do as little data manipulation in the UI layer as possible.  
>
> First thing we need to do is fetch the schedule for a given day.
> The main end point is a GET with a query string build with multiple 'teamId' and 'sportId' in the query string. We will also include the date in YYYY-MM-DD format and the key hydrate with the value 'team'
>
> example: https://statsapi.mlb.com/api/v1/schedule?teamId=146&teamId=385&teamId=467&teamId=564&teamId=554&teamId=619&teamId=3276&teamId=4124&teamId=3277&teamId=479&teamId=2127&sportId=1&sportId=21&sportId=16&sportId=11&sportId=13&sportId=16&sportId=21&sportId=12&sportId=21&sportId=14&sportId=16&date=2025-03-01&hydrate=team
>
> The query key should be 'scheudle' along with the array of teamIds that will be used to build the query.  By default, if no array is passed in, we should use the teamIds exported from the constants file.  We should always use the sportIds array in its totality
>
> For the select function we should take the data and parse it into an array of data to be used to build the ScheduleAndResultsComponent.  Utilize the teamIds array to identify which of the teams is the marlin affiliate. We will also need to add a "link" props to the GameStatus component which we will use for subsequent queries to fill out the current scenario for live games.
>
> Whenever this is a Marlins game (team number is in MARLINS constant [146])  that should be the first game in the list for the schedule/results

## 8. Data Transformation Tweaks

> Some tweaks to updating the data:
>
> If the game is "Scheduled"  the value should be the Date and Time (HH:MM am/pm)
> The marlins affiliate should never have isHome set, only the opponent
> If there is a score to the game is should be posted after the team name in the TeamComponent, we will have to add score as an optional prop and update the component

## 9.  ChatGPT to generate bases svg Icons
> I need simple svg icons that work within Material UI to display the current status of runners on base > in a baseball game. Make it dynamic so that I can pass in props onFirst, onSecond, and/or onThird and > it will make the appropriate base's filled prop true