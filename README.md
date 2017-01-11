# ticker-react

**ticker-react** is an example React client which pulls stock quotes from the (defunct but still available) Google Finance API by using the [ticker-phoenix](https://github.com/philcallister/ticker-phoenix) Elixir Phoenix app. This React client app subsribes to Phoenix Channels with stock ticker symbols and is periodically notified of updates.

To see the **ticker-react** app in action, head over to
- [ticker-elixir](https://github.com/philcallister/ticker-elixr) Elixir OTP app
- [ticker-phonenix] (https://github.com/philcallister/ticker-phoenix) Elixir Phoenix app

##### Example screenshot of the three applications being used together
![Stock Ticker](/screen-shot.gif?raw=true "Stock Ticker Example")

## Environment

The sample was developed using the following 

- OS X El Capitan (10.11)

## Setup

Clone Repo
```bash
git clone https://github.com/philcallister/ticker-react.git
```

##### Dependencies
You'll need [Node](https://nodejs.org/en/) to run the JavaScript server and have access to [NPM](https://www.npmjs.com/). To install on OS X with [Homebrew](http://brew.sh/), run the following brew command
```bash
brew install node
```

## Run It

Start the server

```bash
npm install && npm start
```
You'll want to make sure the Elixir Phoenix app is also running. If you haven't done so, follow the instructions for getting it installed and running at [ticker-phoenix](https://github.com/philcallister/ticker-phoenix).

## See It
With both the Phoenix and React apps started, you can see it in action from your browser by visiting ```http://localhost:3000```

## License

[MIT License](http://www.opensource.org/licenses/MIT)

**Free Software, Hell Yeah!**
