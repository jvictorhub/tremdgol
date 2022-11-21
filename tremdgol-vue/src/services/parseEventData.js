import * as conversorsAndParsersLib from "./auxiliary/conversorsAndParsers";

export function parse2(event) {
  // 07abr2022

  const getTimeStamps = (epochTimeString) => {
    return {
      // NEW TIMESTAMPS properties (correct names)
      time_stringed_ISO_8601: new Date(epochTimeString * 1000), // The 0 there is the key, which sets the date to the epoch
      time_stringed_withZoneBR: getDateDDMMMhhmmMiniZone(new Date(epochTimeString * 1000)), // The 0 there is the key, which sets the date to the epoch
      timeUntilKickOff_stringed: msToTimeddHHmm(new Date(Number(epochTimeString) * 1000).getTime() - new Date().getTime()),
    };
  };
  // NEW TIMESTAMPS properties (correct names)
  let retorno = JSON.parse(JSON.stringify(getTimeStamps(epochTimeString)));

  return retorno;
}

export function parseEventData(
  event,
  favorite_threshold_odd_to_highlight,
  activeMarketObjectKeyToGetOdds,
  homeChartColors,
  awayChartColors,
  chartSettings,
  chartjs_matchOdds_options,
  homeGoalChartColors,
  awayGoalChartColors,
  chartjs_options_default
) {
  // 07abr2022

  // DESTRUCTURING EXAMPLE
  /*
    console.table(this.allLiveEvents.map(event => {
        const {
            timeStamps,
            stringedGameWithRedcards
        } = event; // THIS IS DESTRUCTURING
        return {
            'time': timeStamps.timeUntilKickOff_stringed,
            'evento': stringedGameWithRedcards
        } // returns this object for every item in this.allLiveEvents
    }));
    */

  favorite_threshold_odd_to_highlight = favorite_threshold_odd_to_highlight ? favorite_threshold_odd_to_highlight : 2.5;
  activeMarketObjectKeyToGetOdds = activeMarketObjectKeyToGetOdds ? activeMarketObjectKeyToGetOdds : "over_under_1_5";
  homeChartColors = homeChartColors ? homeChartColors : "rgb(30, 136, 229)"; // blue darken-1 #1E88E5 rgb(30, 136, 229, 0.5)
  awayChartColors = awayChartColors ? awayChartColors : "rgb(175, 192, 192)";
  homeGoalChartColors = homeGoalChartColors ? homeGoalChartColors : "rgb(30, 136, 229, 0.65)";
  awayGoalChartColors = awayGoalChartColors ? awayGoalChartColors : "rgb(175, 192, 192, 0.65)";
  chartSettings = chartSettings
    ? chartSettings
    : {
        chart_matchOdds_fav_line_Yaxis_value: 2,
        chart_matchOdds_Yaxis_max_value: 20,
      };
  chartjs_matchOdds_options = chartjs_matchOdds_options
    ? chartjs_matchOdds_options
    : {
        responsive: true,
        maintainAspectRatio: false,
        // STACKOVERFLOW https://stackoverflow.com/questions/65825141/annotations-are-not-displayed-in-chart-js --> SOLUTION downgrade chartjs from 2.9.4 to  2.9.3
        annotation: {
          annotations: [
            {
              drawTime: "afterDatasetsDraw",
              adjustScaleRange: true,
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: 1,
              borderWidth: 5,
              borderColor: "rgba(0,0,0,0.55)",
              label: { content: "KO", enabled: true, position: "top" },
            },
          ],
        },
      };
  chartjs_options_default = chartjs_options_default
    ? chartjs_options_default
    : {
        responsive: true,
        maintainAspectRatio: false,
        // STACKOVERFLOW https://stackoverflow.com/questions/65825141/annotations-are-not-displayed-in-chart-js --> SOLUTION downgrade chartjs from 2.9.4 to  2.9.3
        annotation: {
          annotations: [
            {
              drawTime: "afterDatasetsDraw",
              adjustScaleRange: true,
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: 1,
              borderWidth: 5,
              borderColor: "rgba(0,0,0,0.55)",
              label: { content: "KO", enabled: true, position: "top" },
            },
          ],
        },
      };

  const parseClubValue = (clubValueNumber) => {
    let clubValue = clubValueNumber / 1000000;
    clubValue = clubValue > 1 ? Math.round(clubValue) + "M" : clubValue > 0 ? clubValue * 1000 + "K" : "";
    return clubValue;
  };
  // STACKOVERFLOW https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-70.php
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  if (!event.isUpcoming) event.isUpcoming = false;
  event.hasSelectedTeam = event.has_selected_team ? true : false;
  if (event.event_odds) {
    event.event_odds.preGameScorePrediction =
      event.event_odds.favorite_odd > 0
        ? event.event_odds.favorite_H_A === "H"
          ? event.event_odds.favorite_odd <= 1.2
            ? "3-0"
            : event.event_odds.favorite_odd <= 1.45
            ? "2-0"
            : event.event_odds.favorite_odd <= 3
            ? "1-0"
            : "error"
          : event.event_odds.favorite_odd <= 1.2
          ? "0-3"
          : event.event_odds.favorite_odd <= 1.45
          ? "0-2"
          : event.event_odds.favorite_odd <= 3
          ? "0-1"
          : "error"
        : "error";
    /* MOVED TO THE END OF THIS FUNCION...
     */
    event.event_odds.homeOddDiff =
      event.event_odds.odds_summary.kickOff.home_odd !== 0
        ? event.event_odds.odds_summary.end.home_odd - event.event_odds.odds_summary.kickOff.home_odd
        : 0;
    event.event_odds.awayOddDiff =
      event.event_odds.odds_summary.kickOff.away_odd !== 0
        ? event.event_odds.odds_summary.end.away_odd - event.event_odds.odds_summary.kickOff.away_odd
        : 0;
    event.event_odds.odds_summary.start.add_time_dateJS = new Date(event.event_odds.odds_summary.start.add_time * 1000).toISOString();
    event.event_odds.odds_summary.kickOff.add_time_dateJS = new Date(event.event_odds.odds_summary.kickOff.add_time * 1000).toISOString();
    event.event_odds.odds_summary.end.add_time_dateJS = new Date(event.event_odds.odds_summary.end.add_time * 1000).toISOString();
  }
  // INITIALIZING ALL NEW VARIABLES FOR THE EVENT
  event.opportunities = event.opportunities ? event.opportunities : [];
  event.tobs = event.tobs ? event.tobs : [];
  event.opportunitiesShow = event.opportunities ? true : false;

  event.showCharts = typeof event.showCharts === "boolean" ? event.showCharts : true;
  event.showLeftPanel = typeof event.showLeftPanel === "boolean" ? event.showLeftPanel : true;
  event.showDattChart = typeof event.showDattChart === "boolean" ? event.showDattChart : false;
  event.show_xGoalsFrame = typeof event.show_xGoalsFrame === "boolean" ? event.show_xGoalsFrame : false;
  event.show_TorvaneySoccerEventLogger = typeof event.show_TorvaneySoccerEventLogger === "boolean" ? event.show_TorvaneySoccerEventLogger : false;
  event.showMoreDetails = typeof event.showMoreDetails === "boolean" ? event.showMoreDetails : false;
  event.currentPace012 = typeof event.currentPace012 === "number" ? event.currentPace012 : 1;

  //console.log('%c ' + (i + 1) + ') ' + event.timeStamps.timeUntilKickOff_stringed + ' | ' + event.stringedGameWithRedcards + ' ', 'color: #333; font-weight: bold; background-color:#fff;');
  let time_kickOffTime = event.timeStamps.time_stringed_ISO_8601;
  event.dateToShow = time_kickOffTime.substring(0, 10) + " " + time_kickOffTime.substring(11, 16) + "Z";
  event.isStartedMatch = new Date() > new Date(event.time * 1000);
  let dd = time_kickOffTime.substring(8, 10);
  let mm = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][Number(time_kickOffTime.substring(5, 7)) - 1];
  event.dateToShow2 = mm + "-" + dd + " " + " " + time_kickOffTime.substring(11, 16) + "Z";
  event.dateToShow_brZone = event.timeStamps.time_stringed_withZoneBR.substring(0, 12) + "";
  event.leagueNameToShow = event.points.league_flag + " " + event.league.name;
  if (event.extra) {
    event.roundToShow = event.extra.round ? "R" + event.extra.round : "";
  } else {
    event.roundToShow = "";
  }
  event.overOdd_start_toShow = event.event_odds.odds_summary.start.handicap + " ⚽ " + event.event_odds.odds_summary.start.over_odd;
  event.favorite_odd_current_toShow =
    event.event_odds.favorite_H_A === "H" ? event.event_odds.odds_summary.end.home_odd : event.event_odds.odds_summary.end.away_odd;
  event.homeNameToShow = event.event_odds.favorite_H_A === "H" ? event.event_odds.favorite_symbol + " " + event.home.name : event.home.name;
  event.awayNameToShow = event.event_odds.favorite_H_A === "A" ? event.away.name + " " + event.event_odds.favorite_symbol : event.away.name;
  event.homeNameTeamBGColor =
    event.event_odds.favorite_H_A === "H" &&
    event.event_odds.favorite_category > 0 &&
    event.favorite_odd_current_toShow >= favorite_threshold_odd_to_highlight
      ? "light-green lighten-3"
      : "transparent";
  event.awayNameTeamBGColor =
    event.event_odds.favorite_H_A === "A" &&
    event.event_odds.favorite_category > 0 &&
    event.favorite_odd_current_toShow >= favorite_threshold_odd_to_highlight
      ? "light-green lighten-3"
      : "transparent";
  event.teamValueFactor = 0;
  if (event.tm_stats && event.tm_stats.total_market_value) {
    event.homeClubValue = event.tm_stats.total_market_value[0] / 1000000;
    event.homeClubValue =
      event.homeClubValue > 1 ? Math.round(event.homeClubValue) + "M" : event.homeClubValue > 0 ? event.homeClubValue * 1000 + "K" : "";
    event.awayClubValue = event.tm_stats.total_market_value[1] / 1000000;
    event.awayClubValue =
      event.awayClubValue > 1 ? Math.round(event.awayClubValue) + "M" : event.awayClubValue > 0 ? event.awayClubValue * 1000 + "K" : "";
    event.totalMarketClubValuesToShow = event.homeClubValue + " v " + event.awayClubValue;
    event.teamValueFactor =
      Math.max(event.tm_stats.total_market_value[0], event.tm_stats.total_market_value[1]) /
      Math.min(event.tm_stats.total_market_value[0], event.tm_stats.total_market_value[1]);
    event.teamValueFactor = Math.round(event.teamValueFactor * 100) / 100;
  }
  event.similarityToShow = event.bf_mostSimilarComparison.eventMostSimilar.name + " [" + event.bf_mostSimilarComparison.greaterSimilarityValue + "]";
  event.similarityToShow += event.bf_mostSimilarComparison.greaterSimilarityValue < 0.55 ? " 🔻" : "";
  event.similarityAlertToShow = event.bf_mostSimilarComparison.greaterSimilarityValue < 0.55 ? "🔻" : " ";
  if (event.bf_mostSimilarComparison_Live) {
    event.similarityToShow_Live =
      event.bf_mostSimilarComparison_Live.eventMostSimilar.name + " [" + event.bf_mostSimilarComparison_Live.greaterSimilarityValue + "]";
    event.similarityToShow_Live += event.bf_mostSimilarComparison_Live.greaterSimilarityValue < 0.55 ? " 🔻" : "";
    event.similarityAlertToShow_Live = event.bf_mostSimilarComparison_Live.greaterSimilarityValue < 0.55 ? "🔻" : " ";
  }
  //event.compareVcardOpen = false;
  event.last10h2hStringed = "";
  event.last10h2hDateStringed = "";
  event.last10h2hLeagueStringed = "";
  event.last10HomeStringed = "";
  event.last10HomeDateStringed = "";
  event.last10HomeLeagueFlagStringed = "";
  event.last10HomeLeagueStringed = "";
  event.last10HomeOpponentValuesStringed = "";
  event.last10HomeHomeValuesStringed = "";
  event.last10HomeAwayValuesStringed = "";
  event.last10HomeResultsPoints = 0;
  event.last10HomeResults = [];
  event.last10HomeResultsEmoji = [];
  event.last10HomeResultsStringed = "";
  event.last10HomeOverHTStringed = "";
  event.last10HomeOver2TStringed = "";
  event.last10HomeOver2_5 = [];
  event.last10HomeOver2_5emoji = [];
  event.last10HomeOver2_5Stringed = "";
  event.last10HomeCleanSheet = [];
  event.last10HomeCleanSheetEmoji = [];
  event.last10HomeCleanSheetStringed = "";
  event.last10HomeTotalGoals = 0;
  event.last10HomeTotalGoalsStringed = "";
  event.last10HomeTotalAndOverSymbolStringed = "";
  event.last10HomeTotalGoalsHT_Array = [];
  event.last10HomeTotalGoals2T_Array = [];
  event.last10HomeTotalGoals2_5_Array = [];
  event.last10Home1tGoals_pct_100 = Math.floor(event.bsfEventsHistory.last10stats.home.gols1t_pct * 100);
  event.last10Home2tGoals_pct_100 = Math.floor(event.bsfEventsHistory.last10stats.home.gols2t_pct * 100);
  event.last10HomeHandicapValuesStringed = "";
  event.last10AwayStringed = "";
  event.last10AwayDateStringed = "";
  event.last10AwayLeagueFlagStringed = "";
  event.last10AwayLeagueStringed = "";
  event.last10AwayOpponentValuesStringed = "";
  event.last10AwayHomeValuesStringed = "";
  event.last10AwayAwayValuesStringed = "";
  event.last10AwayResultsPoints = 0;
  event.last10AwayResults = [];
  event.last10AwayResultsEmoji = [];
  event.last10AwayResultsStringed = "";
  event.last10AwayOverHTStringed = "";
  event.last10AwayOver2TStringed = "";
  event.last10AwayOver2_5 = [];
  event.last10AwayOver2_5emoji = [];
  event.last10AwayOver2_5Stringed = "";
  event.last10AwayCleanSheet = [];
  event.last10AwayCleanSheetEmoji = [];
  event.last10AwayCleanSheetStringed = "";
  event.last10AwayTotalGoals = 0;
  event.last10AwayTotalGoalsStringed = "";
  event.last10AwayTotalAndOverSymbolStringed = "";
  event.last10AwayTotalGoalsHT_Array = [];
  event.last10AwayTotalGoals2T_Array = [];
  event.last10AwayTotalGoals2_5_Array = [];
  event.last10Away1tGoals_pct_100 = Math.floor(event.bsfEventsHistory.last10stats.away.gols1t_pct * 100);
  event.last10Away2tGoals_pct_100 = Math.floor(event.bsfEventsHistory.last10stats.away.gols2t_pct * 100);
  event.last10AwayHandicapValuesStringed = "";
  event.last10HomeGoalsScored = 0;
  event.last10HomeGoalsScoredArray = [];
  event.last10HomeGoalsScored_ht_Array = [];
  event.last10HomeGoalsScored_2t_Array = [];
  event.last10HomeGoalsConceded_ht_Array = [];
  event.last10HomeGoalsConceded_2t_Array = [];
  event.last10HomeGoalsConceded = 0;
  event.last10HomeGoalsConcededArray = [];
  event.last10HomeGoalsScoredSumArray = [];
  event.last10HomeGoalsScoredSum_ht_Array = [];
  event.last10HomeGoalsScoredSum_2t_Array = [];
  event.last10HomeGoalsConcededSum_ht_Array = [];
  event.last10HomeGoalsConcededSum_2t_Array = [];
  event.last10HomeGoalsConcededSumArray = [];
  event.last10AwayGoalsScoredSumArray = [];
  event.last10AwayGoalsScored_ht_Array = [];
  event.last10AwayGoalsScored_2t_Array = [];
  event.last10AwayGoalsConceded_ht_Array = [];
  event.last10AwayGoalsConceded_2t_Array = [];
  event.last10AwayGoalsConcededSumArray = [];
  event.last10AwayGoalsScored = 0;
  event.last10AwayGoalsScoredArray = [];
  event.last10AwayGoalsScoredSum_ht_Array = [];
  event.last10AwayGoalsScoredSum_2t_Array = [];
  event.last10AwayGoalsConcededSum_ht_Array = [];
  event.last10AwayGoalsConcededSum_2t_Array = [];
  event.last10AwayGoalsConceded = 0;
  event.last10AwayGoalsConcededArray = [];
  if (event.bsfEventsHistory) {
    for (const [i, pastEvent] of event.bsfEventsHistory.h2h.entries()) {
      pastEvent.dateToShow = conversorsAndParsersLib.getDateDDMMMYYYYhhmmZone(new Date(Number(pastEvent.time) * 1000)).substring(0, 11);
      pastEvent.redCardsHome = 0;
      pastEvent.redCardsAway = 0;
      const originalstringedGameWithRedcards = pastEvent.stringedGameWithRedcards;
      while (pastEvent.stringedGameWithRedcards.includes("🟥")) {
        pastEvent.redCardsHome +=
          pastEvent.stringedGameWithRedcards.indexOf("🟥") > -1 && pastEvent.stringedGameWithRedcards.indexOf("🟥") < 10 ? 1 : 0;
        pastEvent.redCardsAway +=
          pastEvent.stringedGameWithRedcards.indexOf("🟥") > -1 && pastEvent.stringedGameWithRedcards.indexOf("🟥") > 10 ? 1 : 0;
        pastEvent.stringedGameWithRedcards = pastEvent.stringedGameWithRedcards.replace("🟥", "");
      }
      pastEvent.stringedGameWithRedcards = originalstringedGameWithRedcards;
      if (i < 10) {
        event.last10h2hStringed += "\n" + pastEvent.stringedGameWithRedcards;
        event.last10h2hDateStringed += "\n" + pastEvent.dateToShow;
        event.last10h2hLeagueStringed += "\n" + pastEvent.league_name;
      }
      //if (i === 9) break;
    }
    for (const [i, pastEvent] of event.bsfEventsHistory.home.entries()) {
      //const homeGoals = (pastEvent.totalGoals > 0) ? Number(pastEvent.ss.substring(0, pastEvent.ss.indexOf('-'))) : 0;
      //const awayGoals = (pastEvent.totalGoals > 0) ? Number(pastEvent.ss.substring(pastEvent.ss.indexOf('-') + 1)) : 0;
      const homeGoals = pastEvent.totalGoals > 0 ? Number(pastEvent.fullScore.substring(0, pastEvent.fullScore.indexOf("-"))) : 0;
      const awayGoals =
        pastEvent.totalGoals > 0
          ? Number(pastEvent.fullScore.substring(pastEvent.fullScore.indexOf("-") + 1, pastEvent.fullScore.indexOf("-") + 2))
          : 0;
      const homeGoals_ht =
        pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1
          ? Number(pastEvent.fullScore.substring(pastEvent.fullScore.indexOf("(") + 2, pastEvent.fullScore.indexOf(")") - 3))
          : 0;
      const awayGoals_ht =
        pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1
          ? Number(pastEvent.fullScore.substring(pastEvent.fullScore.indexOf("(") + 3, pastEvent.fullScore.indexOf(")")))
          : 0;
      const homeGoals_2t = pastEvent.totalGoals - pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1 ? homeGoals - homeGoals_ht : 0;
      const awayGoals_2t = pastEvent.totalGoals - pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1 ? awayGoals - awayGoals_ht : 0;
      event.last10HomeGoalsScored += pastEvent.home_name === event.home.name ? homeGoals : awayGoals;
      event.last10HomeGoalsScoredArray.push(pastEvent.home_name === event.home.name ? homeGoals : awayGoals);
      event.last10HomeGoalsScoredSumArray.push(event.last10HomeGoalsScoredArray.reduce((a, b) => a + b, 0));
      event.last10HomeGoalsScored_ht_Array.push(pastEvent.home_name === event.home.name ? homeGoals_ht : awayGoals_ht);
      event.last10HomeGoalsConceded_ht_Array.push(pastEvent.home_name === event.home.name ? awayGoals_ht : homeGoals_ht);
      event.last10HomeGoalsScoredSum_ht_Array.push(event.last10HomeGoalsScored_ht_Array.reduce((a, b) => a + b, 0));
      event.last10HomeGoalsConcededSum_ht_Array.push(event.last10HomeGoalsConceded_ht_Array.reduce((a, b) => a + b, 0));
      event.last10HomeGoalsScored_2t_Array.push(pastEvent.home_name === event.home.name ? homeGoals_2t : awayGoals_2t);
      event.last10HomeGoalsConceded_2t_Array.push(pastEvent.home_name === event.home.name ? awayGoals_2t : homeGoals_2t);
      event.last10HomeGoalsScoredSum_2t_Array.push(event.last10HomeGoalsScored_2t_Array.reduce((a, b) => a + b, 0));
      event.last10HomeGoalsConcededSum_2t_Array.push(event.last10HomeGoalsConceded_2t_Array.reduce((a, b) => a + b, 0));
      event.last10HomeGoalsConceded += pastEvent.home_name === event.home.name ? awayGoals : homeGoals;
      event.last10HomeGoalsConcededArray.push(pastEvent.home_name === event.home.name ? awayGoals : homeGoals);
      event.last10HomeGoalsConcededSumArray.push(event.last10HomeGoalsConcededArray.reduce((a, b) => a + b, 0));
      event.last10HomeStringed += "\n" + pastEvent.stringedGameWithRedcards;
      event.last10HomeDateStringed += "\n" + conversorsAndParsersLib.getDateDDMMMhhmmZone(new Date(Number(pastEvent.time) * 1000)).substring(0, 6);
      event.last10HomeLeagueFlagStringed += "\nflag";
      event.last10HomeLeagueStringed += "\n" + pastEvent.league_name + "                        " + pastEvent.stringedGameWithRedcards;
      event.last10HomeOpponentValuesStringed += "\n" + (pastEvent.tm_stats ? pastEvent.tm_stats.home_market_value : "null");
      event.last10HomeHomeValuesStringed += "\n" + (pastEvent.tm_stats ? parseClubValue(pastEvent.tm_stats.home_market_value) : "null");
      event.last10HomeAwayValuesStringed += "\n" + (pastEvent.tm_stats ? parseClubValue(pastEvent.tm_stats.away_market_value) : "null");
      event.last10HomeResultsPoints += pastEvent.result === "W" ? 3 : pastEvent.result === "D" ? 1 : 0;
      event.last10HomeResults.push(pastEvent.result);
      event.last10HomeResultsEmoji.push(pastEvent.result === "W" ? "💚" : pastEvent.result === "D" ? "💙" : "💔");
      event.last10HomeResultsStringed += "\n" + pastEvent.result;
      event.last10HomeOverHTStringed += "\n" + (pastEvent.totalGoalsHT > 0 ? pastEvent.totalGoalsHT + "" : "");
      event.last10HomeOver2TStringed +=
        "\n" + (pastEvent.totalGoals - pastEvent.totalGoalsHT > 0 ? pastEvent.totalGoals - pastEvent.totalGoalsHT + "" : "");
      event.last10HomeOver2_5emoji.push(pastEvent.totalGoals > 2.5 ? "➕" : "");
      event.last10HomeOver2_5Stringed += "\n" + (pastEvent.totalGoals > 2.5 ? "➕" : "");
      event.last10HomeTotalGoalsHT_Array.push(homeGoals_ht + awayGoals_ht);
      event.last10HomeTotalGoals2T_Array.push(homeGoals_2t + awayGoals_2t);
      event.last10HomeTotalGoals2_5_Array.push(homeGoals_ht + awayGoals_ht + homeGoals_2t + awayGoals_2t);
      event.last10HomeTotalGoals += pastEvent.totalGoals;
      event.last10HomeTotalGoalsStringed += "\n" + pastEvent.totalGoals;
      event.last10HomeTotalAndOverSymbolStringed +=
        "\n" + (pastEvent.totalGoals > 0 ? pastEvent.totalGoals : " ") + (pastEvent.totalGoals > 2.5 ? "➕" : "");
      event.last10HomeHandicapValuesStringed +=
        "\n" + (pastEvent.kickoff_odds && pastEvent.kickoff_odds["1_2"] ? pastEvent.kickoff_odds["1_2"].handicap : "");
      if (i === 9) break;
    }
    for (const [i, pastEvent] of event.bsfEventsHistory.away.entries()) {
      //const homeGoals = (pastEvent.totalGoals > 0) ? Number(pastEvent.ss.substring(0, pastEvent.ss.indexOf('-'))) : 0;
      //const awayGoals = (pastEvent.totalGoals > 0) ? Number(pastEvent.ss.substring(pastEvent.ss.indexOf('-') + 1)) : 0;
      const homeGoals = pastEvent.totalGoals > 0 ? Number(pastEvent.fullScore.substring(0, pastEvent.fullScore.indexOf("-"))) : 0;
      const awayGoals =
        pastEvent.totalGoals > 0
          ? Number(pastEvent.fullScore.substring(pastEvent.fullScore.indexOf("-") + 1, pastEvent.fullScore.indexOf("-") + 2))
          : 0;
      const homeGoals_ht =
        pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1
          ? Number(pastEvent.fullScore.substring(pastEvent.fullScore.indexOf("(") + 2, pastEvent.fullScore.indexOf(")") - 3))
          : 0;
      const awayGoals_ht =
        pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1
          ? Number(pastEvent.fullScore.substring(pastEvent.fullScore.indexOf("(") + 3, pastEvent.fullScore.indexOf(")")))
          : 0;
      const homeGoals_2t = pastEvent.totalGoals - pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1 ? homeGoals - homeGoals_ht : 0;
      const awayGoals_2t = pastEvent.totalGoals - pastEvent.totalGoalsHT > 0 && pastEvent.fullScore.indexOf("(") > -1 ? awayGoals - awayGoals_ht : 0;
      event.last10AwayGoalsScored += pastEvent.home_name === event.away.name ? homeGoals : awayGoals;
      event.last10AwayGoalsScoredArray.push(pastEvent.home_name === event.away.name ? homeGoals : awayGoals);
      event.last10AwayGoalsScoredSumArray.push(event.last10AwayGoalsScoredArray.reduce((a, b) => a + b, 0));
      event.last10AwayGoalsScored_ht_Array.push(pastEvent.home_name === event.away.name ? homeGoals_ht : awayGoals_ht);
      event.last10AwayGoalsConceded_ht_Array.push(pastEvent.home_name === event.away.name ? awayGoals_ht : homeGoals_ht);
      event.last10AwayGoalsScoredSum_ht_Array.push(event.last10AwayGoalsScored_ht_Array.reduce((a, b) => a + b, 0));
      event.last10AwayGoalsConcededSum_ht_Array.push(event.last10AwayGoalsConceded_ht_Array.reduce((a, b) => a + b, 0));
      event.last10AwayGoalsScored_2t_Array.push(pastEvent.home_name === event.away.name ? homeGoals_2t : awayGoals_2t);
      event.last10AwayGoalsConceded_2t_Array.push(pastEvent.home_name === event.away.name ? awayGoals_2t : homeGoals_2t);
      event.last10AwayGoalsScoredSum_2t_Array.push(event.last10AwayGoalsScored_2t_Array.reduce((a, b) => a + b, 0));
      event.last10AwayGoalsConcededSum_2t_Array.push(event.last10AwayGoalsConceded_2t_Array.reduce((a, b) => a + b, 0));
      event.last10AwayGoalsConceded += pastEvent.home_name === event.away.name ? awayGoals : homeGoals;
      event.last10AwayGoalsConcededArray.push(pastEvent.home_name === event.away.name ? awayGoals : homeGoals);
      event.last10AwayGoalsConcededSumArray.push(event.last10AwayGoalsConcededArray.reduce((a, b) => a + b, 0));
      event.last10AwayStringed += "\n" + pastEvent.stringedGameWithRedcards;
      event.last10AwayDateStringed += "\n" + conversorsAndParsersLib.getDateDDMMMhhmmZone(new Date(Number(pastEvent.time) * 1000)).substring(0, 6);
      event.last10AwayLeagueFlagStringed += "\nflag";
      event.last10AwayLeagueStringed += "\n" + pastEvent.league_name + "                        " + pastEvent.stringedGameWithRedcards;
      event.last10AwayOpponentValuesStringed += "\n" + (pastEvent.tm_stats ? pastEvent.tm_stats.home_market_value : "null");
      event.last10AwayHomeValuesStringed += "\n" + (pastEvent.tm_stats ? parseClubValue(pastEvent.tm_stats.home_market_value) : "null");
      event.last10AwayAwayValuesStringed += "\n" + (pastEvent.tm_stats ? parseClubValue(pastEvent.tm_stats.away_market_value) : "null");
      event.last10AwayResultsPoints += pastEvent.result === "W" ? 3 : pastEvent.result === "D" ? 1 : 0;
      event.last10AwayResults.push(pastEvent.result);
      event.last10AwayResultsEmoji.push(pastEvent.result === "W" ? "💚" : pastEvent.result === "D" ? "💙" : "💔");
      event.last10AwayResultsStringed += "\n" + pastEvent.result;
      event.last10AwayOverHTStringed += "\n" + (pastEvent.totalGoalsHT > 0 ? "" + pastEvent.totalGoalsHT : " ");
      event.last10AwayOver2TStringed +=
        "\n" + (pastEvent.totalGoals - pastEvent.totalGoalsHT > 0 ? pastEvent.totalGoals - pastEvent.totalGoalsHT + "" : "");
      event.last10AwayOver2_5emoji.push(pastEvent.totalGoals > 2.5 ? "➕" : "");
      event.last10AwayOver2_5Stringed += "\n" + (pastEvent.totalGoals > 2.5 ? "➕" : " ");
      event.last10AwayTotalGoalsHT_Array.push(homeGoals_ht + awayGoals_ht);
      event.last10AwayTotalGoals2T_Array.push(homeGoals_2t + awayGoals_2t);
      event.last10AwayTotalGoals2_5_Array.push(homeGoals_ht + awayGoals_ht + homeGoals_2t + awayGoals_2t);
      event.last10AwayTotalGoals += pastEvent.totalGoals;
      event.last10AwayTotalGoalsStringed += "\n" + pastEvent.totalGoals;
      event.last10AwayTotalAndOverSymbolStringed +=
        "\n" + (pastEvent.totalGoals > 2.5 ? "➕" : "") + (pastEvent.totalGoals > 0 ? pastEvent.totalGoals : " ");
      event.last10AwayHandicapValuesStringed +=
        "\n" + (pastEvent.kickoff_odds && pastEvent.kickoff_odds["1_2"] ? pastEvent.kickoff_odds["1_2"].handicap : "");
      if (i === 9) break;
    }
  }
  event.last10HomeResultsStringed = event.last10HomeResultsStringed.replaceAll("W", "💚");
  event.last10HomeResultsStringed = event.last10HomeResultsStringed.replaceAll("D", "💙");
  event.last10HomeResultsStringed = event.last10HomeResultsStringed.replaceAll("L", "💔");
  event.last10AwayResultsStringed = event.last10AwayResultsStringed.replaceAll("W", "💚");
  event.last10AwayResultsStringed = event.last10AwayResultsStringed.replaceAll("D", "💙");
  event.last10AwayResultsStringed = event.last10AwayResultsStringed.replaceAll("L", "💔");

  event.last10HomeHTscoringHalves = event.last10HomeGoalsScored_ht_Array.length - countOccurrences(event.last10HomeGoalsScored_ht_Array, 0);
  event.last10Home2TscoringHalves = event.last10HomeGoalsScored_2t_Array.length - countOccurrences(event.last10HomeGoalsScored_2t_Array, 0);
  event.last10AwayHTscoringHalves = event.last10AwayGoalsScored_ht_Array.length - countOccurrences(event.last10AwayGoalsScored_ht_Array, 0);
  event.last10Away2TscoringHalves = event.last10AwayGoalsScored_2t_Array.length - countOccurrences(event.last10AwayGoalsScored_2t_Array, 0);

  event.last10HomeHTconcededHalves = event.last10HomeGoalsConceded_ht_Array.length - countOccurrences(event.last10HomeGoalsConceded_ht_Array, 0);
  event.last10Home2TconcededHalves = event.last10HomeGoalsConceded_2t_Array.length - countOccurrences(event.last10HomeGoalsConceded_2t_Array, 0);
  event.last10AwayHTconcededHalves = event.last10AwayGoalsConceded_ht_Array.length - countOccurrences(event.last10AwayGoalsConceded_ht_Array, 0);
  event.last10Away2TconcededHalves = event.last10AwayGoalsConceded_2t_Array.length - countOccurrences(event.last10AwayGoalsConceded_2t_Array, 0);

  event.last10HomeHTavgTotalGoals = event.last10HomeGoalsScored_ht_Array.reduce((a, b) => a + b, 0) / event.last10HomeGoalsScored_ht_Array.length;
  event.last10Home2TavgTotalGoals = event.last10HomeGoalsScored_2t_Array.reduce((a, b) => a + b, 0) / event.last10HomeGoalsScored_2t_Array.length;
  event.last10AwayHTavgTotalGoals = event.last10AwayGoalsScored_ht_Array.reduce((a, b) => a + b, 0) / event.last10AwayGoalsScored_ht_Array.length;
  event.last10Away2TavgTotalGoals = event.last10AwayGoalsScored_2t_Array.reduce((a, b) => a + b, 0) / event.last10AwayGoalsScored_2t_Array.length;

  event.last10HomeHTavgConcededGoals =
    event.last10HomeGoalsConceded_ht_Array.reduce((a, b) => a + b, 0) / event.last10HomeGoalsConceded_ht_Array.length;
  event.last10Home2TavgConcededGoals =
    event.last10HomeGoalsConceded_2t_Array.reduce((a, b) => a + b, 0) / event.last10HomeGoalsConceded_2t_Array.length;
  event.last10AwayHTavgConcededGoals =
    event.last10AwayGoalsConceded_ht_Array.reduce((a, b) => a + b, 0) / event.last10AwayGoalsConceded_ht_Array.length;
  event.last10Away2TavgConcededGoals =
    event.last10AwayGoalsConceded_2t_Array.reduce((a, b) => a + b, 0) / event.last10AwayGoalsConceded_2t_Array.length;

  event.last10HomeGoalsAvg = (
    event.last10HomeGoalsScoredSumArray[event.last10HomeGoalsScoredSumArray.length - 1] / event.last10HomeGoalsScoredSumArray.length
  ).toFixed(1);

  event.last10AwayGoalsAvg = (
    event.last10AwayGoalsScoredSumArray[event.last10AwayGoalsScoredSumArray.length - 1] / event.last10AwayGoalsScoredSumArray.length
  ).toFixed(1);

  event.last5HomeGoalsAvg = (event.last10HomeGoalsScoredSumArray[4] / 5).toFixed(1);
  event.last5AwayGoalsAvg = (event.last10AwayGoalsScoredSumArray[4] / 5).toFixed(1);

  ///////////////////////////////////////////// USED IN eventNotes.vue --- START
  /*
  event.last10HomeGoalsScored_ht_Array = event.last10HomeGoalsScored_ht_Array;
  event.last10HomeGoalsScored_2t_Array = event.last10HomeGoalsScored_2t_Array;
  event.last10AwayGoalsScored_ht_Array = event.last10AwayGoalsScored_ht_Array;
  event.last10AwayGoalsScored_2t_Array = event.last10AwayGoalsScored_2t_Array;
  */
  event.last10stats_home_o0_5ht = event.bsfEventsHistory.last10stats.home.o0_5ht;
  event.last10stats_away_o0_5ht = event.bsfEventsHistory.last10stats.away.o0_5ht;
  event.last10stats_home_o0_52t = event.bsfEventsHistory.last10stats.home.o0_52t;
  event.last10stats_away_o0_52t = event.bsfEventsHistory.last10stats.away.o0_52t;

  event.last10stats_home_o2_5 = event.bsfEventsHistory.last10stats.home.o2_5;
  event.last10stats_away_o2_5 = event.bsfEventsHistory.last10stats.away.o2_5;
  event.last10_Home_htScoringHalvesPoints = event.last10HomeGoalsScored_ht_Array.filter((item) => item !== 0).length;
  event.last10_Home_2tScoringHalvesPoints = event.last10HomeGoalsScored_2t_Array.filter((item) => item !== 0).length;
  event.last10_Away_htScoringHalvesPoints = event.last10AwayGoalsScored_ht_Array.filter((item) => item !== 0).length;
  event.last10_Away_2tScoringHalvesPoints = event.last10AwayGoalsScored_2t_Array.filter((item) => item !== 0).length;
  event.t2_halvesWithGoalsPoints = (event.last10stats_home_o0_52t + event.last10stats_away_o0_52t) / 4;
  event.ht_halvesWithGoalsPoints = (event.last10stats_home_o0_5ht + event.last10stats_away_o0_5ht) / 4;
  event.fav_2T_scoringHalvesPoints =
    event.event_odds.favorite_H_A === "H" ? event.last10_Home_2tScoringHalvesPoints / 2 : event.last10_Away_2tScoringHalvesPoints / 2;
  event.fav_HT_scoringHalvesPoints =
    event.event_odds.favorite_H_A === "H" ? event.last10_Home_htScoringHalvesPoints / 2 : event.last10_Away_htScoringHalvesPoints / 2;

  event.miniDashOverTotalPoints_max20 =
    +event.t2_halvesWithGoalsPoints + event.ht_halvesWithGoalsPoints + event.fav_HT_scoringHalvesPoints + event.fav_2T_scoringHalvesPoints;
  ///////////////////////////////////////////// USED IN eventNotes.vue --- END

  // console.log(time_kickOffTime) //​ "2021-04-12T16:12:59.865Z"
  event.dateJS = new Date(time_kickOffTime.substring(0, 19));
  // console.log(event.dateJS)// Mon Apr 12 2021 16:07:32 GMT-0300 (Horário Padrão de Brasília)
  event.dateJS.setTime(event.dateJS.getTime() - 1000 * 60 * 60 * 3);
  event.bf_mostSimilarComparison.bf_odds.activeMartket_live = event.bf_mostSimilarComparison.bf_odds[activeMarketObjectKeyToGetOdds];
  const parseMarketStatusToEmoji = (mktStatus) => {
    return mktStatus === "OPEN" ? "🟢" : mktStatus === "SUSPENDED" ? "🟡" : mktStatus === "CLOSED" ? "🔴" : mktStatus;
  };
  const parseMarketTotalMatched = (totalMatchedNumber) => {
    let theReturn = totalMatchedNumber / 1000;
    //clubValue = clubValue > 1 ? Math.round(clubValue) + "M" : clubValue > 0 ? clubValue * 1000 + "K" : "";
    theReturn = theReturn.toFixed(0) + "K";
    return theReturn;
  };
  if (event.bf_mostSimilarComparison.bf_odds.activeMartket_live) {
    /*
    event.bf_mostSimilarComparison.bf_odds.activeMartket_live.status === "OPEN"
      ? "🟢"
      : event.bf_mostSimilarComparison.bf_odds.activeMartket_live.status === "SUSPENDED"
      ? "🟡"
      : event.bf_mostSimilarComparison.bf_odds.activeMartket_live.status === "CLOSED"
      ? "🔴"
      : event.bf_mostSimilarComparison.bf_odds.activeMartket_live.status;
      */
    event.bf_mostSimilarComparison.bf_odds.activeMartket_live.statusToShow = parseMarketStatusToEmoji(
      event.bf_mostSimilarComparison.bf_odds.activeMartket_live.status
    );
  }
  if (event.bf_odds_live) {
    Object.keys(event.bf_odds_live).map((key) => {
      event.bf_odds_live[key].totalMatched_toShow = parseMarketTotalMatched(event.bf_odds_live[key].totalMatched);
      event.bf_odds_live[key].statusEmoji = parseMarketStatusToEmoji(event.bf_odds_live[key].status);
    });
  }
  if (event.bf_mostSimilarComparison && event.bf_mostSimilarComparison.bf_odds) {
    Object.keys(event.bf_mostSimilarComparison.bf_odds).map((key) => {
      event.bf_mostSimilarComparison.bf_odds[key].totalMatched_toShow = parseMarketTotalMatched(
        event.bf_mostSimilarComparison.bf_odds[key].totalMatched
      );
      event.bf_mostSimilarComparison.bf_odds[key].statusEmoji = parseMarketStatusToEmoji(event.bf_mostSimilarComparison.bf_odds[key].status);
    });
  }

  event.tipsStringed = "";
  if (event.tips) {
    event.tips.map((tip) => {
      event.tipsStringed += "\n" + JSON.stringify(tip);
    });
    event.tipsStringed2 = "";
    event.tipsStatusesStringed = "";
    event.tips.map((tip) => {
      event.tipsStatusesStringed += tip.result;
      event.tipsStringed2 += "\n" + tip.tipCatText + " | " + tip.tipBufferText + " " + tip.result;
    });
  }
  let maxMLMaxOdd = 0;
  if (event.bf_odds_live_history) {
    // STACKOVERFLOW https://codesandbox.io/s/3dzt9?file=/src/components/LineChart.js:0-135
    // STACKOVERFLOW https://vue-chartjs.org/guide/#example
    let matchOddsChartMinutesArray = [];
    let chartHomeOddsArray = [];
    let chartAwayOddsArray = [];
    event.bf_odds_live_history.match_odds.history.map((odd) => {
      matchOddsChartMinutesArray.push(odd.m);
      chartHomeOddsArray.push(odd.h);
      chartAwayOddsArray.push(odd.a);
      maxMLMaxOdd = Math.max(odd.h, odd.a, maxMLMaxOdd);
      //console.log('maxMLMaxOdd = '+maxMLMaxOdd)
    });
    event.matchOddsChartData = {
      labels: matchOddsChartMinutesArray,
      datasets: [
        {
          label: "Home odds",
          data: chartHomeOddsArray,
          fill: false,
          borderColor: homeChartColors,
          tension: 0.1,
        },
        {
          label: "Away odds",
          data: chartAwayOddsArray,
          fill: false,
          borderColor: awayChartColors,
          tension: 0.1,
        },
        {
          label: "Fav line",
          data: JSON.parse("[" + (chartSettings.chart_matchOdds_fav_line_Yaxis_value + ",").repeat(chartAwayOddsArray.length).slice(0, -1) + "]"), // slice removes the last comma inserted, to not break the parse
          fill: false,
          borderColor: "rgb(175, 155, 55)",
          tension: 0.1,
        },
      ],
    };
    // ▶▶▶▶▶ over under 2.5 chart
    let overUnder2_5ChartMinutesArray = [];
    let chartOver2_5OddsArray = [];
    event.bf_odds_live_history.over_under_2_5.history.map((odd) => {
      overUnder2_5ChartMinutesArray.push(odd.m);
      chartOver2_5OddsArray.push(odd.o);
    });
    // ▶▶▶▶▶ over under 0.5 HT chart
    let overUnder0_5_HTChartMinutesArray = [];
    let chartOver0_5_HTOddsArray = [];
    event.bf_odds_live_history.over_under_0_5_HT.history.map((odd) => {
      overUnder0_5_HTChartMinutesArray.push(odd.m);
      chartOver0_5_HTOddsArray.push(odd.o);
    });
    event.overUnder2_5ChartData = {
      labels: overUnder2_5ChartMinutesArray,
      datasets: [
        {
          label: "Over 2.5 odds",
          data: chartOver2_5OddsArray,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Over 0.5 HT odds",
          data: chartOver0_5_HTOddsArray,
          fill: false,
          borderColor: "rgb(35, 162, 192)",
          tension: 0.1,
        },
      ],
    };
    //event.chartjs_options_default = JSON.parse(JSON.stringify(chartjs_options_default))
    event.chartjs_matchOdds_options = JSON.parse(JSON.stringify(chartjs_matchOdds_options));
    //console.log('home_odd = ' + event.bf_odds_live.match_odds.home_odd)
    //console.log('away_odd = ' + event.bf_odds_live.match_odds.away_odd)
    //console.log('maxMLMaxOdd = ' + maxMLMaxOdd)

    if (maxMLMaxOdd >= 20) {
      event.chartjs_matchOdds_options.scales = {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              min: 0,
              max: 20,
              stepSize: 1,
            },
          },
        ],
      };
    }
    event.chartjs_options_overChart = JSON.parse(JSON.stringify(chartjs_options_default));
    event.chartjs_options_overChart.scales = {
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
            min: 1,
            max: 4,
            stepSize: 1,
          },
        },
      ],
    };
    let koXaxisValue = 0;
    for (let i = 0; i < overUnder2_5ChartMinutesArray.length; i++) {
      // changes every starting 0 to 'pre', so that the only correct 0 will be the first before first minute number diff than 0
      if (overUnder2_5ChartMinutesArray[i] === 0) {
        overUnder2_5ChartMinutesArray[i] = "pre";
        matchOddsChartMinutesArray[i] = "pre";
        koXaxisValue++;
      } else {
        overUnder2_5ChartMinutesArray[i - 1] = 0;
        matchOddsChartMinutesArray[i - 1] = 0;
        break;
      }
    }

    //console.log(event.fullName + ' | koXaxisValue = ' + koXaxisValue)
    event.chartjs_options_overChart.annotation.annotations[0].value = 0; // sets the KICK OFF ANNOTATION VERT LINE x value
    //event.chartjs_options_default.annotation.annotations[0].value = 0
    event.chartjs_matchOdds_options.annotation.annotations[0].value = 0; // sets the KICK OFF ANNOTATION VERT LINE x value
    event.eventsToShow_onlyGoals.map((goal) => {
      /*
"eventsToShow_onlyGoals": [
            {
              "id": "84576722",
              "text": "67' - 1st Goal - Porro  (Sporting) -",
              "symbolToShow": "⚽️",
              "minuteToShow": "67'",
              "minuteSequential": 22100,
              "brClock": "2T 22:00",
              "homeOrAway": "A"
            }           }
                    */
      /*
                            event.chartjs_options_default.annotation.annotations.push({
                                drawTime: "afterDatasetsDraw",
                                adjustScaleRange: true,
                                type: "line",
                                mode: "vertical",
                                scaleID: "x-axis-0",
                                value: Number(goal.minuteToShow.substring(0, goal.minuteToShow.indexOf("'"))),
                                borderWidth: 5,
                                borderColor: "red",
                                label: {
                                    content: "GOAL",
                                    enabled: true,
                                    position: "top"
                                }
                            })
                            */
      event.chartjs_matchOdds_options.annotation.annotations.push({
        drawTime: "afterDatasetsDraw",
        adjustScaleRange: true,
        type: "line",
        mode: "vertical",
        scaleID: "x-axis-0",
        value: Number(goal.minuteToShow.substring(0, goal.minuteToShow.indexOf("'"))),
        borderWidth: 5,
        //borderColor: "red",
        borderColor: goal.homeOrAway === "H" ? homeGoalChartColors : awayGoalChartColors,
        label: {
          content: "" + " " + goal.minuteToShow, // "GOAL"  'goal' '⚽'
          enabled: true,
          position: goal.homeOrAway === "H" ? "top" : "top",
        },
      });
      //console.log('goal = '+JSON.stringify(goal))
      //console.log('minute of goal = ' + Number(goal.minuteToShow.substring(0, goal.minuteToShow.indexOf("'"))))
    });
  }

  if (event.points.pointsHistory) {
    // STACKOVERFLOW https://codesandbox.io/s/3dzt9?file=/src/components/LineChart.js:0-135
    // STACKOVERFLOW https://vue-chartjs.org/guide/#example
    let dattChartMinutesArray = [];
    let chartDattHomeArray = [];
    let chartDattAwayArray = [];
    let chartDattDiffLineArray = [];
    event.points.pointsHistory.dattHist.map((val) => {
      dattChartMinutesArray.push(val.m);
      chartDattHomeArray.push(val.h);
      chartDattAwayArray.push(val.a);
      chartDattDiffLineArray.push(val.h - val.a);
    });
    event.dattChartData = {
      labels: dattChartMinutesArray,
      datasets: [
        {
          label: "Home datt",
          data: chartDattHomeArray,
          fill: false,
          borderColor: homeChartColors,
          tension: 0.1,
        },
        {
          label: "Away datt",
          data: chartDattAwayArray,
          fill: false,
          borderColor: awayChartColors,
          tension: 0.1,
        },
        {
          label: "diff line (h-a)",
          data: chartDattDiffLineArray,
          fill: false,
          borderColor: "rgb(175, 155, 55)",
          tension: 0.1,
        },
      ],
    };

    let koXaxisValue_datt = 0;
    for (let i = 0; i < dattChartMinutesArray.length; i++) {
      // changes every starting 0 to 'pre', so that the only correct 0 will be the first before first minute number diff than 0
      if (dattChartMinutesArray[i] === 0) {
        dattChartMinutesArray[i] = "pre";
        koXaxisValue_datt++;
      } else {
        dattChartMinutesArray[i - 1] = 0;
        break;
      }
    }
    //console.log(event.fullName + ' | koXaxisValue_datt = ' + koXaxisValue_datt);
    event.chartjs_options_dattChart = JSON.parse(JSON.stringify(chartjs_options_default));
    event.chartjs_options_dattChart.annotation.annotations[0].value = 0;
  }
  event.points.pointsStringedWithBars_home = event.points.pointsStringedWithBars.substring(0, event.points.pointsStringedWithBars.indexOf("-"));
  event.points.pointsStringedWithBars_away = event.points.pointsStringedWithBars.substring(event.points.pointsStringedWithBars.indexOf("-") + 1);
  event.points.att_home_pct = Math.round((event.points.att_home / (event.points.att_home + event.points.att_away)) * 100);
  event.points.att_away_pct = Math.round((event.points.att_away / (event.points.att_home + event.points.att_away)) * 100);
  event.points.datt_home_pct = Math.round((event.points.datt_home / (event.points.datt_home + event.points.datt_away)) * 100);
  event.points.datt_away_pct = Math.round((event.points.datt_away / (event.points.datt_home + event.points.datt_away)) * 100);
  event.points.datt_per_minute_home =
    event.minute && event.points.datt_home ? (Number(event.points.datt_home) / Number(event.minute)).toFixed(2) : "no dattpm";
  event.points.datt_per_minute_away =
    event.minute && event.points.datt_away ? (Number(event.points.datt_away) / Number(event.minute)).toFixed(2) : "no dattpm";
  event.points.corners_home = event.points.corners_home ? Number(event.points.corners_home) : 0;
  event.points.corners_away = event.points.corners_away ? Number(event.points.corners_away) : 0;
  //delete event.bf_odds_live_history
  //delete event.tips

  // FAVORITE FACTOR CODE
  const getFavFactorCodeBGColor = (event) => {
    let theReturn = " transparent";
    if (event.event_odds.favFactorKickOff_toUse.includes("FH") && event.event_odds.favFactorKickOff_toUse < "FH9") {
      theReturn = " green lighten-2";
    } else if (event.event_odds.favFactorKickOff_toUse.includes("FA") && event.event_odds.favFactorKickOff_toUse < "FA9") {
      theReturn = " grey lighten-1";
    }
    event.eventsToShow_2 = arrangeEventsToShow(event);
    return theReturn;
  };

  event.event_odds.odds_summary.kickOff2 = getKickOffOdds2FromOddsHistory(event.event_odds.odds_summary.kickOff, event.bsf_odds_live_history);

  event.event_odds.favoriteFactorCode_start = getFavoriteFactorCode(event.event_odds.odds_summary.start);
  event.event_odds.favoriteFactorCode_kickOff = getFavoriteFactorCode(event.event_odds.odds_summary.kickOff);
  event.event_odds.favoriteFactorCode_kickOff2 = getFavoriteFactorCode(event.event_odds.odds_summary.kickOff2); // from history, if exists, if not, uses kickOff
  event.event_odds.favoriteFactorCode_end = getFavoriteFactorCode(event.event_odds.odds_summary.end);

  event.event_odds.favFactorKickOff_toUse =
    event.event_odds.favoriteFactorCode_kickOff2 !== "F!!"
      ? event.event_odds.odds_summary.kickOff.ss === null ||
        event.event_odds.odds_summary.kickOff.ss === undefined ||
        event.event_odds.odds_summary.kickOff.ss === "0-0"
        ? event.event_odds.favoriteFactorCode_kickOff2
        : event.event_odds.favoriteFactorCode_start
      : event.event_odds.favoriteFactorCode_end;

  event.event_odds.odds_summary.kickOff_toUse =
    event.event_odds.favoriteFactorCode_kickOff2 !== "F!!"
      ? event.event_odds.odds_summary.kickOff.ss === null ||
        event.event_odds.odds_summary.kickOff.ss === undefined ||
        event.event_odds.odds_summary.kickOff.ss === "0-0"
        ? event.event_odds.odds_summary.kickOff2
        : event.event_odds.odds_summary.start
      : event.event_odds.odds_summary.end;
  event.event_odds.favFactorCodeBGColor = getFavFactorCodeBGColor(event);

  // FAVORITE FACTOR CODE
  const getScorePrediction = (oddsSummaryObject) => {
    let theReturn = "error";
    if (oddsSummaryObject.home_odd !== 0 && oddsSummaryObject.away_odd !== 0) {
      if (oddsSummaryObject.home_odd <= oddsSummaryObject.away_odd) {
        theReturn =
          oddsSummaryObject.home_odd <= 1.2 ? "3-0" : oddsSummaryObject.home_odd <= 1.45 ? "2-0" : oddsSummaryObject.home_odd <= 3 ? "1-0" : "error";
      } else if (oddsSummaryObject.away_odd <= oddsSummaryObject.home_odd) {
        theReturn =
          oddsSummaryObject.away_odd <= 1.2 ? "0-3" : oddsSummaryObject.away_odd <= 1.45 ? "0-2" : oddsSummaryObject.away_odd <= 3 ? "0-1" : "error";
      }
    }

    //['First Half Goals 0.5', 'First Half Goals 1.5',  'Over/Under 0.5 Goals', 'Over/Under 1.5 Goals',
    event.totalGoals = event.totalGoals ? event.totalGoals : 0;
    event.goalLineMarketNamesBF = {
      oneMoreGoal: "Over/Under " + event.totalGoals + ".5 Goals",
      twoMoreGoals: "Over/Under " + (event.totalGoals + 1) + ".5 Goals",
      oneMoreGoalHT: "First Half Goals " + event.totalGoals + ".5",
      twoMoreGoalsHT: "First Half Goals " + (event.totalGoals + 1) + ".5",
    };

    return theReturn;
  };

  event.event_odds.preGameScorePrediction = getScorePrediction(
    event.event_odds.favoriteFactorCode_kickOff2 !== "F!!"
      ? event.event_odds.odds_summary.kickOff.ss === undefined || event.event_odds.odds_summary.kickOff.ss === "0-0"
        ? event.event_odds.odds_summary.kickOff
        : event.event_odds.odds_summary.start
      : event.event_odds.odds_summary.end
  );

  event.flags = parseEventFlags(event); // event.event_odds.favFactorKickOff_toUse is a must to get dropping odds
  event.timeStamps = conversorsAndParsersLib.getTimeStamps_parseEpochTimeToTimeToKO(event.time);
}

export function getKickOffOdds2FromOddsHistory(oddsSummaryKickOffObject, bsf_odds_live_history) {
  // generate a new KICKOFF odds from bsf_odds_live_history because sometimes
  // the odds_summary kickoff comes with ss different than 0-0 (early goals happen and the API returns wrong data)
  // this methods uses the bsf_odds_live_history that I collect with my own robots
  let theReturn = JSON.parse(JSON.stringify(oddsSummaryKickOffObject));
  const bsf_odds_live_history_EXAMPLE = { match_odds: { history: [{ m: 0, h: "4.200", d: "3.300", a: "1.950", ss: null }] } };
  const kickOff2_EXAMPLE = {
    home_odd: 4.75,
    draw_odd: 3.2,
    away_odd: 1.833,
    ss: "0-0",
    t: "1",
    home_prob: 21.1,
    draw_prob: 31.3,
    away_prob: 54.6,
    over_odd: 1.875,
    handicap: 2.25,
  };
  if (bsf_odds_live_history) {
    if (bsf_odds_live_history.match_odds.history.length > 0) {
      const oddsHistoryWithZeroMinute = bsf_odds_live_history.match_odds.history.filter((item) => item.m === 0);
      const oddToUse = oddsHistoryWithZeroMinute.pop();
      //console.error(JSON.stringify(oddToUse,null,2))
      if (oddToUse && oddToUse.h) {
        theReturn = {
          home_odd: oddToUse.h.includes(".") ? Number(oddToUse.h) : oddsSummaryKickOffObject.home_odd,
          draw_odd: oddToUse.d.includes(".") ? Number(oddToUse.d) : oddsSummaryKickOffObject.draw_odd,
          away_odd: oddToUse.a.includes(".") ? Number(oddToUse.a) : oddsSummaryKickOffObject.away_odd,
          ss: oddToUse.ss ? oddToUse.ss : "0-0",
          t: oddToUse.m.toString(),
          home_prob: "err",
          draw_prob: "err",
          away_prob: "err",
          over_odd: oddsSummaryKickOffObject.over_odd,
          handicap: oddsSummaryKickOffObject.handicap,
        };
      }
    }
  }
  return theReturn;
}

export function getFavoriteFactorCode(oddsSummaryObject) {
  let theReturn = "F";
  if (oddsSummaryObject.home_odd !== 0 && oddsSummaryObject.away_odd !== 0) {
    theReturn += oddsSummaryObject.home_odd < oddsSummaryObject.away_odd ? "H" : oddsSummaryObject.away_odd < oddsSummaryObject.home_odd ? "A" : "0";
    const charTable =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZaaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffgggggggggghhhhhhhhhhiiiiiiiiiijjjjjjjjjjkkkkkkkkkkllllllllllmmmmmmmmmmnnnnnnnnnnooooooooooppppppppppqqqqqqqqqqrrrrrrrrrrssssssssssttttttttttuuuuuuuuuuvvvvvvvvvv";

    if (theReturn.charAt(1) === "H") {
      theReturn += charTable.charAt(Math.floor((Number(oddsSummaryObject.home_odd.toFixed(2)) - 1) * 10));
    } else if (theReturn.charAt(1) === "A") {
      theReturn += charTable.charAt(Math.floor((Number(oddsSummaryObject.away_odd.toFixed(2)) - 1) * 10));
    } else {
      theReturn += "!";
    }
  } else {
    theReturn = "F!!";
  }
  return theReturn;
}

export function createLocalStorageEventNotesOfEvents(eventsArray) {
  console.warn("createLocalStorageEventNotesOfEvents --- START");
  const eventNotes_defaultValues = {
    totalFouls: 0,
    totalStoppageMinutes: 0,
    totalMiraculousDefenses: 0,
    totalGreatPOBs: 0,
    totalGreatPOBs_perMinute: 0,
    totalGreatPOBs_emoji: "⚪",
    greatPOBs: { h: 0, a: 0 },
    totalPossiblePenaltiesAttacks: 0,
    totalPossiblePenaltiesAttacks_perMinute: 0,
    totalPossiblePenaltiesAttacks_emoji: "⚪",
    possiblePenaltiesAttacks: { h: 0, a: 0 },
    totalMissedGreatChances: 0,
    totalMissedGreat_perMinute: 0,
    totalMissedGreatChances_emoji: "⚪",
    missedGreatChances: { h: 0, a: 0 },
    TOBs: { h: 0, a: 0 },
    totalLostBigChances: { h: 0, a: 0 },
    draftTextAreaContent: "notes => must score? pobs?",
    draftTextStoppageTimeAreaContent: "stoppage notes",
    pregameScorePredicion: {
      home: 0,
      away: 0,
    },
    pregameOverHTreliability: 1,
    liveOverHTreliability: 1,
    underOverChecklist_values: {
      pobs_3stars: { switch_color: "error", switch_value: false, weight: 3, text: "POBs ⭐⭐⭐" }, //
      pobs: { switch_color: "orange", switch_value: false, weight: 2, text: "POBs " }, //
      mustWin: { switch_color: "orange", switch_value: false, weight: 2, text: "Must win favorite" }, //
      powerfulFWs: { switch_color: "orange", switch_value: false, weight: 2, text: "Powerfull strikers" }, //
      greatDefenses: { switch_color: "orange", switch_value: false, weight: 2, text: "Miracolous Defenses" }, //
      weather: { switch_color: "orange", switch_value: false, weight: 2, text: "Weather and field" }, //
      eliminatedSide: { switch_color: "orange", switch_value: false, weight: 2, text: "Eliminated side?" }, //
      noGoalCurrenteHalf: { switch_color: "primary", switch_value: false, weight: 1, text: "No goal current half?" }, //
      best11starters: { switch_color: "primary", switch_value: false, weight: 1, text: "Best starting 11?" }, //
      favoriteHome: { switch_color: "primary", switch_value: false, weight: 1, text: "Favorite at home?" }, //
      favoriteLosing: { switch_color: "primary", switch_value: false, weight: 1, text: "Favorite losing?" }, //
      statsHistory: { switch_color: "primary", switch_value: false, weight: 1, text: "Stats history" }, //
      onTargerShots: { switch_color: "primary", switch_value: false, weight: 1, text: "On target shots" }, //
      pace: { switch_color: "primary", switch_value: false, weight: 1, text: "High pace" }, //
      fouls: { switch_color: "primary", switch_value: false, weight: 1, text: "Few fouls" }, //
      passCorrectness: { switch_color: "primary", switch_value: false, weight: 1, text: "Correct passes" }, //
      noRedCards: { switch_color: "primary", switch_value: false, weight: 1, text: "No red cards🟥" }, //
      interestingMatch: { switch_color: "primary", switch_value: false, weight: 1, text: "Interesting match" }, //
      wackyRaceNot: { switch_color: "primary", switch_value: false, weight: 1, text: "⚠ NOT wacky race" }, //
      derbyNot: { switch_color: "primary", switch_value: false, weight: 1, text: "⚠ NOT derby" }, //
    },
  };
  if (!localStorage.tremdgolWebAllEventsNotes) {
    localStorage.tremdgolWebAllEventsNotes = JSON.stringify({ description: "local storage for all events notes", events: [] });
  }
  let tremdgolWebAllEventsNotes = JSON.parse(localStorage.tremdgolWebAllEventsNotes);
  eventsArray.map((event) => {
    if (tremdgolWebAllEventsNotes.events.filter((ev) => ev.event_id === event.id).length > 0) {
      // object already exists
    } else {
      // create a new one
      tremdgolWebAllEventsNotes.events.push({
        event: event.fullNameStringedWithClock,
        event_id: event.id,
        league_id: event.league.id,
        eventNotes: JSON.parse(JSON.stringify(eventNotes_defaultValues)),
        period: event.clock.period === "2T" ? "2H" : "1H",
      });
      console.warn(event.fullName + " eventNote created");
    }
    if (tremdgolWebAllEventsNotes.events.length > 200) {
      // removing old events from the local storage (trash)
      tremdgolWebAllEventsNotes.events = tremdgolWebAllEventsNotes.events.splice(100); // splice removes the first X elements
    }
    localStorage.tremdgolWebAllEventsNotes = JSON.stringify(tremdgolWebAllEventsNotes);
  });
  console.warn("createLocalStorageEventNotesOfEvents --- END");
}

export function parseInplayEventsV1Data(inplayEventsV1_rawData) {
  let theReturn = null;
  if (inplayEventsV1_rawData) {
    if (inplayEventsV1_rawData.results) {
      theReturn = JSON.parse(JSON.stringify(inplayEventsV1_rawData));
      theReturn.results.map((event) => {
        event.timeStamps = conversorsAndParsersLib.getTimeStamps_parseEpochTimeToTimeToKO(event.time);
        event.fullName = event.home.name + " - " + event.away.name;
        if (event.timer) {
          event.timerParsed = event.timer.tm + ":" + event.timer.ts + " tt" + event.timer.tt + " ta" + event.timer.ta + " md" + event.timer.md;
        } else {
          event.timerParsed = "timerParsed error | no event.timer";
        }
        event.expandedView = false;
        event.brClock = getBRClock(event);
        event.enClock = getENClockFromBRClock(event.brClock);
        event.scoresParsed = getScoresParsed(event);
        event.fullNameStringedWithClock = event.home.name + " " + event.scoresParsed + " " + event.away.name + " (" + event.brClock + ")";
      });
    }
    return theReturn;
  }
}

export function parseInplayEventsV3Data(inplayEventsV3_rawData) {
  let theReturn = null;
  if (inplayEventsV3_rawData) {
    if (inplayEventsV3_rawData.results) {
      theReturn = JSON.parse(JSON.stringify(inplayEventsV3_rawData));
      theReturn.results.map((event) => {
        event.timeStamps = conversorsAndParsersLib.getTimeStamps_parseEpochTimeToTimeToKO(event.time);
        event.fullName = event.home.name + " - " + event.away.name;
        if (event.timer) {
          event.timerParsed = event.timer.tm + ":" + event.timer.ts + " tt" + event.timer.tt + " ta" + event.timer.ta + " md" + event.timer.md;
        } else {
          event.timerParsed = "timerParsed error | no event.timer";
        }
        event.expandedView = false;
        event.brClock = getBRClock(event);
        event.enClock = getENClockFromBRClock(event.brClock);
        event.scoresParsed = getScoresParsed(event);
        event.fullNameStringedWithClock = event.home.name + " " + scoresParsed + " " + event.away.name + " (" + event.brClock + ")";
      });
    }
    return theReturn;
  }
}

export function parseInplayEventsDefaultData_fromBNRscanner(event) {
  // https://api.betsapi.com/v1/event/view?token=TOKEN&event_id=[eventIds]
  if (event.scores) {
    event.allSS = { eventView: { ss: event.ss, timer: event.timer, fullName: event.home.name + " x " + event.away.name } };
    event.score_ht = event.scores["1"] ? event.scores["1"].home + "-" + event.scores["1"].away : "";
    event.score_ft = event.scores["2"].home + "-" + event.scores["2"].away;
    event.score = event.score_ft + (event.score_ht ? " (" + event.score_ht + ")" : "");
    event.totalGoals_home = event.scores["2"] ? Number(event.scores["2"].home) : null;
    event.totalGoals_away = event.scores["2"] ? Number(event.scores["2"].away) : null;
    event.totalGoals = event.scores["2"] ? event.totalGoals_home + event.totalGoals_away : null;
    event.totalGoalsHT_home = event.scores["1"] ? Number(event.scores["1"].home) : event.totalGoals_home;
    event.totalGoalsHT_away = event.scores["1"] ? Number(event.scores["1"].away) : event.totalGoals_away;
    event.totalGoalsHT = event.scores["1"] ? event.totalGoalsHT_home + event.totalGoalsHT_away : event.totalGoals_home + event.totalGoals_away;
  } else {
    event.allSS = { eventView: { ss: event.ss, timer: event.timer, fullName: event.home.name + " x " + event.away.name } };
    event.score_ht = "0-0";
    event.score_ft = "0-0";
    event.score = event.score_ft;
  }
  event.updated_at = new Date();
  event.brClock = getBRClock(event);
  event.minuteClock = translateEventMinuteClockToEnglish(getMinuteClock(event));
  event.enClock = translateEventBRClockToEnglish(event.brClock);
  event.clock = getClock(event);
  event.fullName = event.home.name + " v " + event.away.name;
  //event.fullName_fromBFdictionary = StringSimilarity_LIB.getBFeventNameFromBSFeventFullName(event.fullName);
  event.fullNameStringedWithClock = event.home.name + " " + (event.ss ? event.ss : " x ") + " " + event.away.name + " (" + event.brClock + ")";
  //event.stringedGameWithRedcards = getStringedGameWithRedcards(event);
  //event.stringedGameWithRedcardsAndClock = event.stringedGameWithRedcards + " (" + event.brClock + ")";
  //event.stringedGameWithRedcardsAndClock_en = event.stringedGameWithRedcards + " (" + event.enClock + ")";
  //event.stringedGameWithRedcards_boldScore = getStringedGameWithRedcards(event, "boldScore");
  let minute = 90;
  if (event.timer) {
    var timerJSON = event.timer;
    if (timerJSON.tm !== null && timerJSON.ts !== null) {
      minute = Number(timerJSON.tm);
    } /* else {
          var minute = 1000;
        }
        */
  }
  event.minute = event.minuteClock && event.minuteClock === "pre-game" ? 0 : minute + 1;
  //let defaultMarketValues = getDefaultMarketValues();
  /*
  if (!event.tm_stats) {
    event.tm_stats = defaultMarketValues;
  }
  */
}

function getClock(gameJSON) {
  // 29out20
  //     console.log('gameJSON = %s', gameJSON);
  var timerJSON = gameJSON.timer;
  // console.log('timerJSON = %s', timerJSON);

  var retorno = "pre-jogo";
  if (timerJSON) {
    if (timerJSON.tm !== null && timerJSON.ts !== null) {
      var minute = timerJSON.tm;
      var second = timerJSON.ts;
    } else {
      var minute = "mm";
      var second = "ss";
    }

    if (second < 10) {
      second = "0" + second;
    }
    //if (gameJSON.scores[1]){
    if (gameJSON.timer) {
      if (gameJSON.timer.md == 1) {
        // 1T encerrado: second half or intervalo
        if (timerJSON.tt == "0") {
          if (timerJSON.tm > 75) {
            // há um bug quando o um jogo termina ele fica um tempo md=1, tm=90, tt=0 ts=0 ta=0
            retorno = "FT";
            retorno = { brClock: retorno, period: "", minute: 0, second: 0 };
          } else {
            retorno = "intervalo";
            retorno = { brClock: retorno, period: "", minute: 0, second: 0 };
          }
        } else {
          minute = minute - 45;
          retorno = "2T" + " " + minute + ":" + second;
          retorno = { brClock: retorno, period: "2T", minute: minute, second: second };
        }
      } else if (gameJSON.timer.md > 1) {
        retorno = "FT";
        retorno = { brClock: retorno, period: "", minute: 0, second: 0 };
      } else {
        // 1T não terminou: still first half or match did not start
        if (timerJSON.tt == "0") {
          retorno = "pre-jogo";
          retorno = { brClock: retorno, period: "", minute: 0, second: 0 };
        } else {
          retorno = "1T" + " " + minute + ":" + second;
          retorno = { brClock: retorno, period: "1T", minute: minute, second: second };
        }
      }
    }
  }
  if (gameJSON.time_status == "3") {
    retorno = "FT";
    retorno = { brClock: retorno, period: "", minute: 0, second: 0 };
  }
  // } else {
  // retorno = 'erroClock';
  // }
  return retorno;
}

export function getBRClock(gameJSON) {
  // 29out20 // 09sep2021 => moved to "BSF Msvc BOT - scanner BSF collector scripts"  microservice BSF odds collector (loopador)
  //     console.log('gameJSON = %s', gameJSON);
  var timerJSON = gameJSON.timer;
  // console.log('timerJSON = %s', timerJSON);

  var retorno = "pre-jogo";
  if (timerJSON) {
    if (timerJSON.tm !== null && timerJSON.ts !== null) {
      var minute = timerJSON.tm;
      var second = timerJSON.ts;
    } else {
      var minute = "mm";
      var second = "ss";
    }

    if (second < 10) {
      second = "0" + second;
    }
    //if (gameJSON.scores[1]){
    if (gameJSON.timer.md == 1) {
      // 1T encerrado: second half or intervalo
      if (timerJSON.tt == "0") {
        if (timerJSON.tm > 75) {
          // há um bug quando o um jogo termina ele fica um tempo md=1, tm=90, tt=0 ts=0 ta=0
          retorno = "FT";
        } else {
          retorno = "intervalo";
        }
      } else {
        retorno = "2T" + " " + (minute - 45) + ":" + second;
      }
    } else if (gameJSON.timer.md > 1) {
      retorno = "FT";
    } else {
      // 1T não terminou: still first half or match did not start
      if (timerJSON.tt == "0") {
        retorno = "pre-jogo";
      } else {
        retorno = "1T" + " " + minute + ":" + second;
      }
    }
  }
  if (gameJSON.time_status == "3") {
    retorno = "FT";
  }
  // } else {
  // retorno = 'erroClock';
  // }
  return retorno;
}

export function getBRClockFromTimer(gameJSON, timerJSON) {
  // 2022may22
  var retorno = "pre-jogo";
  if (timerJSON) {
    if (timerJSON.tm !== null && timerJSON.ts !== null) {
      var minute = timerJSON.tm;
      var second = timerJSON.ts;
    } else {
      var minute = "mm";
      var second = "ss";
    }

    if (second < 10) {
      second = "0" + second;
    }
    //if (gameJSON.scores[1]){
    if (gameJSON.timer.md == 1) {
      // 1T encerrado: second half or intervalo
      if (timerJSON.tt == "0") {
        if (timerJSON.tm > 75) {
          // há um bug quando o um jogo termina ele fica um tempo md=1, tm=90, tt=0 ts=0 ta=0
          retorno = "FT";
        } else {
          retorno = "intervalo";
        }
      } else {
        retorno = "2T" + " " + (minute - 45) + ":" + second;
      }
    } else if (gameJSON.timer.md > 1) {
      retorno = "FT";
    } else {
      // 1T não terminou: still first half or match did not start
      if (timerJSON.tt == "0") {
        retorno = "pre-jogo";
      } else {
        retorno = "1T" + " " + minute + ":" + second;
      }
    }
  }
  if (gameJSON.time_status == "3") {
    retorno = "FT";
  }
  // } else {
  // retorno = 'erroClock';
  // }
  return retorno;
}

export function parseEventAllSStoFullNameWithSSandClock(allSSData) {
  return (
    allSSData.fullName.substring(0, allSSData.fullName.indexOf(" x ")) +
    " " +
    allSSData.ss +
    " " +
    allSSData.fullName.substring(allSSData.fullName.indexOf(" x ") + 3, allSSData.fullName.length) +
    ` (` +
    allSSData.brClock +
    `)`
  );
}

export function getScoresParsed(gameJSON) {
  let theReturn = "";
  if (gameJSON.scores) {
    theReturn = gameJSON.scores["2"].home + "-" + gameJSON.scores["2"].away;
    theReturn += gameJSON.scores["1"] ? " (" + gameJSON.scores["1"].home + "-" + gameJSON.scores["1"].away + ")" : "";
  } else {
    theReturn = "❌x❌";
  }
  return theReturn;
}

export function getENClockFromBRClock(brClock) {
  // 2022may15
  return brClock.replace("1T", "1H").replace("2T", "2H").replace("pre-jogo", "pre-game").replace("intervalo", "half-time");
}

export function parseEventFlags(event) {
  // EVENT FLAGS
  /*
💚 100boe
💛 90boe
💃 Swinging odds
⭐️ fav acima do treshold
🟢 Pontuação de chutes
🔥 Datt por min
🚗 wacky race : proporção total DATT / total SHOTS = taxa de conversão ataque em finalização. 🚗= se muito baixo, é corrida maluca som de notificação será uma buzina BIBI!!

red flags: (pintar fundo em vermelho)
3⭕0-0 


/* 💃 Swinging odds FULL CHECKLIST:
          
          1. placar 0-0
          2. minuto  entre 5 e 25
          3. Variação de odd maior que o treshold para home ou away (atualmente em 10%)
          
          FUTURAMENTE (VALIDAR VIA HISTORICO)
          4. Oscilação invertida se home sobe, away desce, se away sobe, home desce, os dois nao podem ter o mesmo sentido. sempre contrário
          5. Over odd inicial linha 2.5 bf maxima @ 2.3 (faz sentido?)
          6. Sincronizar oscilação com betfair (precisa normalizar as odds betfair pois tem muita coisa maluca, por ex, descartar quando a oscilção for maior que 20% de um minuto para outro,)
          
          */
  let theReturn = {
    allActiveCrossedFlagsNamesArray: [],
    swingingOdds: false, // 💃
    dattPerMin: false,
    boe100_array: [],
    wackyRace: false, //🚗
    droppingOdds: { status: false, home_or_away: null, value: 0, pct: 0, description: "when some team has dropping odds before match start" }, //H -0.2 💧 13%
    crossedScoring_home: {
      status: false,
      value_scoring: 0,
      value_conceded: 0,
      description: "when some team has high scoring % and another has high conceding %",
    }, //H 9🔀9
    crossedScoring_away: {
      status: false,
      value_scoring: 0,
      value_conceded: 0,
      description: "when some team has high scoring % and another has high conceding %",
    }, //H 9🔀9
    crossedScoring_home_ht: {
      status: false,
      value_scoring: 0,
      value_conceded: 0,
      description: "when some team has high HT scoring % and another has high HT conceding %",
    }, //H 9🔀9 ht
    crossedScoring_away_ht: {
      status: false,
      value_scoring: 0,
      value_conceded: 0,
      description: "when some team has high HT scoring % and another has high HT conceding %",
    }, //H 9🔀9 ht
    crossedScoring_home_2h: {
      status: false,
      value_scoring: 0,
      value_conceded: 0,
      description: "when some team has high 2nd Half scoring % and another has high 2nd Half conceding %",
    }, //H 9🔀9 2h
    crossedScoring_away_2h: {
      status: false,
      value_scoring: 0,
      value_conceded: 0,
      description: "when some team has high 2nd Half scoring % and another has high 2nd Half conceding %",
    }, //H 9🔀9 2h
    redFlag_3xNoGoalMatchInLast10combined: {
      status: false,
      homeGoallessTotal: 0,
      awayGoallessTotal: 0,
      description: "when last 10 match of both teams combine for 3 or more goalless matches",
    },
    redFlag_teamCleanSheetsInAhalf: {
      flags: [], // { status: false, home_or_away: "-", half_1H_or_2H: 0, teamCleanSheetsInThisHalf: 0 }
      description: "when a side do not conceded many goals in a certain half",
    },
  };
  const underdogPlusMinusPercentMinValue = 10;
  if (event.ss === "0-0") {
    if (event.minute && event.minute >= 3 && event.minute <= 65) {
      //10 a 25
      if (event.stats && event.stats.redcards && event.stats.redcards[0] === "0" && event.stats.redcards[1] === "0") {
        const bsfOddsMinute1 = event.bsf_odds_live_history.match_odds.history.filter((odd) => odd.m > 0)[0];
        const bfOddsOverunder2_5Minute1 = event.bf_odds_live_history.over_under_2_5.history.filter((odd) => odd.m > 0)[0];
        const bfOddsOverunder0_5HTminute1 = event.bf_odds_live_history.over_under_0_5_HT.history.filter((odd) => odd.m > 0)[0];
        /* FIRST VERSION
              const earlyHomeAvgOdd = event.event_odds.odds_summary.kickOff.home_odd // in the future improve to get the average odd of minutes 2-5
              const earlyAwayAvgOdd = event.event_odds.odds_summary.kickOff.away_odd
        */
        // SECOND VERSION
        const earlyHomeAvgOdd =
          event.event_odds.odds_summary.kickOff.home_odd != 0 ? event.event_odds.odds_summary.kickOff.home_odd : Number(bsfOddsMinute1.h); // in the future improve to get the average odd of minutes 2-5
        console.log(`earlyHomeAvgOdd = ` + earlyHomeAvgOdd);
        const earlyAwayAvgOdd =
          event.event_odds.odds_summary.kickOff.away_odd != 0 ? event.event_odds.odds_summary.kickOff.away_odd : Number(bsfOddsMinute1.a); // in the future improve to get the average odd of minutes 2-5
        console.log(`earlyAwayAvgOdd = ` + earlyAwayAvgOdd);

        const currentHomeOdd = event.event_odds.odds_summary.end.home_odd;
        console.log(`currentHomeOdd = ` + currentHomeOdd);
        const currentAwayOdd = event.event_odds.odds_summary.end.away_odd;
        console.log(`currentAwayOdd = ` + currentAwayOdd);

        const homeOddFluctuation = earlyHomeAvgOdd >= currentHomeOdd ? earlyHomeAvgOdd - currentHomeOdd : currentHomeOdd - earlyHomeAvgOdd;
        const awayOddFluctuation = earlyAwayAvgOdd >= currentAwayOdd ? earlyAwayAvgOdd - currentAwayOdd : currentAwayOdd - earlyAwayAvgOdd;

        const homeOddFluctuation_percent = (homeOddFluctuation / earlyHomeAvgOdd) * 100;
        console.log("homeOddFluctuation_percent = " + homeOddFluctuation_percent.toFixed(2) + "% (" + homeOddFluctuation + `)`);
        const awayOddFluctuation_percent = (awayOddFluctuation / earlyAwayAvgOdd) * 100;
        console.log("awayOddFluctuation_percent = " + awayOddFluctuation_percent.toFixed(2) + "% (" + awayOddFluctuation + `)`);

        const homeOddFluctuation_toShow = homeOddFluctuation.toFixed(2) + (earlyHomeAvgOdd >= currentHomeOdd ? "📉" : "📈");
        const awayOddFluctuation_toShow = awayOddFluctuation.toFixed(2) + (earlyAwayAvgOdd >= currentAwayOdd ? "📉" : "📈");

        if (homeOddFluctuation_percent >= underdogPlusMinusPercentMinValue || awayOddFluctuation_percent >= underdogPlusMinusPercentMinValue) {
          theReturn.swingingOdds = true;
        }
      }
    }
  }
  if (event.bsfEventsHistory.last10stats.home.o0_5ht === 10) {
    theReturn.boe100_array.push({ homeOrAway: "H", htOr2h: "HT" });
    theReturn.allActiveCrossedFlagsNamesArray.push("boe100_home_ht");
  }
  if (event.bsfEventsHistory.last10stats.away.o0_5ht === 10) {
    theReturn.boe100_array.push({ homeOrAway: "A", htOr2h: "HT" });
    theReturn.allActiveCrossedFlagsNamesArray.push("boe100_away_ht");
  }
  if (event.bsfEventsHistory.last10stats.home.o0_52t === 10) {
    theReturn.boe100_array.push({ homeOrAway: "H", htOr2h: "2H" });
    theReturn.allActiveCrossedFlagsNamesArray.push("boe100_home_2t");
  }
  if (event.bsfEventsHistory.last10stats.away.o0_52t === 10) {
    theReturn.boe100_array.push({ homeOrAway: "A", htOr2h: "2H" });
    theReturn.allActiveCrossedFlagsNamesArray.push("boe100_away_2t");
  }

  //if (Number(event.points.datt_per_minute_home) + Number(event.points.datt_per_minute_away) > 1.3) {
  if (Number(event.points.datt_per_minute) > 1.3) {
    //theReturnevent.isThisEvent100boe = true;
    theReturn.dattPerMin = true;
  }
  event.points.totalDatt = event.points.datt_home + event.points.datt_away;
  event.points.totalShots = event.points.total_shots_home + event.points.total_shots_away;
  if (event.points.datt_per_minute > 0.8 && event.points.totalShots / event.points.totalDatt < 0.2) {
    theReturn.wackyRace = true;
  }

  if (event.event_odds.favFactorKickOff_toUse) {
    const homeOddVariationStartToKO = event.event_odds.odds_summary.kickOff_toUse.home_odd - event.event_odds.odds_summary.start.home_odd;
    const awayOddVariationStartToKO = event.event_odds.odds_summary.kickOff_toUse.away_odd - event.event_odds.odds_summary.start.away_odd;
    if (homeOddVariationStartToKO < -0.01) {
      theReturn.droppingOdds.home_or_away = "H";
      theReturn.droppingOdds.value = homeOddVariationStartToKO;
      theReturn.droppingOdds.pct = Math.abs(homeOddVariationStartToKO / event.event_odds.odds_summary.kickOff_toUse.home_odd) * 100;
    } else if (awayOddVariationStartToKO < -0.01) {
      theReturn.droppingOdds.home_or_away = "A";
      theReturn.droppingOdds.value = awayOddVariationStartToKO;
      theReturn.droppingOdds.pct = Math.abs(awayOddVariationStartToKO / event.event_odds.odds_summary.kickOff_toUse.away_odd) * 100;
    }
    theReturn.droppingOdds.homeOddVariationStartToKO = homeOddVariationStartToKO;
    theReturn.droppingOdds.awayOddVariationStartToKO = awayOddVariationStartToKO;
    theReturn.droppingOdds.status = Math.abs(theReturn.droppingOdds.value) > 0.01;
  }

  if (event.bsfEventsHistory.last10stats.home.scored >= 8 && 10 - event.bsfEventsHistory.last10stats.away.cleanSheet >= 8) {
    theReturn.allActiveCrossedFlagsNamesArray.push("crossedScoring_home");
    theReturn.crossedScoring_home.status = true;
    theReturn.crossedScoring_home.value_scoring = event.bsfEventsHistory.last10stats.home.scored;
    theReturn.crossedScoring_home.value_conceded = 10 - event.bsfEventsHistory.last10stats.away.cleanSheet;
  }
  if (event.bsfEventsHistory.last10stats.away.scored >= 8 && 10 - event.bsfEventsHistory.last10stats.home.cleanSheet >= 8) {
    theReturn.allActiveCrossedFlagsNamesArray.push("crossedScoring_away");
    theReturn.crossedScoring_away.status = true;
    theReturn.crossedScoring_away.value_scoring = event.bsfEventsHistory.last10stats.away.scored;
    theReturn.crossedScoring_away.value_conceded = 10 - event.bsfEventsHistory.last10stats.home.cleanSheet;
  }
  if (event.last10HomeHTscoringHalves >= 5 && event.last10AwayHTconcededHalves >= 5) {
    theReturn.allActiveCrossedFlagsNamesArray.push("crossedScoring_home_ht");
    theReturn.crossedScoring_home_ht.status = true;
    theReturn.crossedScoring_home_ht.value_scoring = event.last10HomeHTscoringHalves;
    theReturn.crossedScoring_home_ht.value_conceded = event.last10AwayHTconcededHalves;
  }
  if (event.last10AwayHTscoringHalves >= 5 && event.last10HomeHTconcededHalves >= 5) {
    theReturn.allActiveCrossedFlagsNamesArray.push("crossedScoring_away_ht");
    theReturn.crossedScoring_away_ht.status = true;
    theReturn.crossedScoring_away_ht.value_scoring = event.last10AwayHTscoringHalves;
    theReturn.crossedScoring_away_ht.value_conceded = event.last10HomeHTconcededHalves;
  }
  if (event.last10Home2TscoringHalves >= 6 && event.last10Away2TconcededHalves >= 5) {
    theReturn.allActiveCrossedFlagsNamesArray.push("crossedScoring_home_2h");
    theReturn.crossedScoring_home_2h.status = true;
    theReturn.crossedScoring_home_2h.value_scoring = event.last10Home2TscoringHalves;
    theReturn.crossedScoring_home_2h.value_conceded = event.last10Away2TconcededHalves;
  }
  if (event.last10Away2TscoringHalves >= 6 && event.last10Home2TconcededHalves >= 5) {
    theReturn.allActiveCrossedFlagsNamesArray.push("crossedScoring_away_2h");
    theReturn.crossedScoring_away_2h.status = true;
    theReturn.crossedScoring_away_2h.value_scoring = event.last10Away2TscoringHalves;
    theReturn.crossedScoring_away_2h.value_conceded = event.last10Home2TconcededHalves;
  }
  if (event.bsfEventsHistory.last10stats.home.o0_5 + event.bsfEventsHistory.last10stats.away.o0_5 <= 17) {
    theReturn.redFlag_3xNoGoalMatchInLast10combined.status = true;
    theReturn.redFlag_3xNoGoalMatchInLast10combined.homeGoallessTotal = 10 - event.bsfEventsHistory.last10stats.home.o0_5;
    theReturn.redFlag_3xNoGoalMatchInLast10combined.awayGoallessTotal = 10 - event.bsfEventsHistory.last10stats.away.o0_5;
  }

  if (event.last10HomeHTconcededHalves < 4) {
    theReturn.redFlag_teamCleanSheetsInAhalf.flags.push({
      status: true,
      home_or_away: "H",
      half_1H_or_2H: "1H",
      teamCleanSheetsInThisHalf: 10 - event.last10HomeHTconcededHalves,
    });
  }
  if (event.last10Home2TconcededHalves < 4) {
    theReturn.redFlag_teamCleanSheetsInAhalf.flags.push({
      status: true,
      home_or_away: "H",
      half_1H_or_2H: "2H",
      teamCleanSheetsInThisHalf: 10 - event.last10Home2TconcededHalves,
    });
  }
  if (event.last10AwayHTconcededHalves < 5) {
    theReturn.redFlag_teamCleanSheetsInAhalf.flags.push({
      status: true,
      home_or_away: "A",
      half_1H_or_2H: "1H",
      teamCleanSheetsInThisHalf: 10 - event.last10AwayHTconcededHalves,
    });
  }
  if (event.last10Away2TconcededHalves < 5) {
    theReturn.redFlag_teamCleanSheetsInAhalf.flags.push({
      status: true,
      home_or_away: "A",
      half_1H_or_2H: "2H",
      teamCleanSheetsInThisHalf: 10 - event.last10Away2TconcededHalves,
    });
  }

  if (event.allSS) {
    const ALLSS_EXAMPLE = {
      eventView: { ss: "1-2", timer: { tm: 58, ts: 23, tt: "1", ta: 0, md: 1 }, fullName: "Atletico Grau x Alianza Atletico" },
      inplayEvents_v1: { ss: "1-2", timer: { tm: 59, ts: 15, tt: "1", ta: 0, md: 1 }, fullName: "Atletico Grau x Alianza Atletico" },
      inplayEvents_v3: { ss: "1-2", timer: { tm: 59, ts: 15, tt: "1", ta: 0, md: 1 }, fullName: "Atletico Grau x Alianza Atletico" },
      inPlayEventsBSF: { ss: "1-2", timer: { tm: 59, ts: 19, tt: "1", ta: 0, md: 1 }, fullName: "Atletico Grau x Alianza Atletico" },
    };
    event.allSS.eventView.brClock = event.allSS.eventView ? getBRClockFromTimer(event, event.allSS.eventView.timer) : null;
    event.allSS.eventView.fullNameWithSSandClock = parseEventAllSStoFullNameWithSSandClock(event.allSS.eventView);
    if (event.allSS.inplayEvents_v1) {
      event.allSS.inplayEvents_v1.brClock = getBRClockFromTimer(event, event.allSS.inplayEvents_v1.timer);
      event.allSS.inplayEvents_v1.fullNameWithSSandClock = parseEventAllSStoFullNameWithSSandClock(event.allSS.inplayEvents_v1);
    }
    if (event.allSS.inplayEvents_v3) {
      event.allSS.inplayEvents_v3.brClock = getBRClockFromTimer(event, event.allSS.inplayEvents_v3.timer);
      event.allSS.inplayEvents_v3.fullNameWithSSandClock = parseEventAllSStoFullNameWithSSandClock(event.allSS.inplayEvents_v3);
    }
    if (event.allSS.inPlayEventsBSF) {
      event.allSS.inPlayEventsBSF.brClock = getBRClockFromTimer(event, event.allSS.inPlayEventsBSF.timer);
      event.allSS.inPlayEventsBSF.fullNameWithSSandClock = parseEventAllSStoFullNameWithSSandClock(event.allSS.inPlayEventsBSF);
    }
  }
  return theReturn;
}

export function arrangeEventsToShow(eventJSON) {
  // from bnr scanner 2022may17
  /*
  {
          "id": "69738346",
          "text": "63' - 2nd Yellow Card - Joao Cancelo (Man City)"
        },
        {
          "id": "69738463",
          "text": "64' - 10th Corner - Arsenal"
        },
        {
          "id": "69738505",
          "text": "65' - Substitution - Gundogan for Aguero (Man City)"
        },
        {
          "id": "69738724",
          "text": "68' - 3rd Yellow Card - Dias (Man City)"
        },
        */
  //console.log("arrangeEventsToShow(" + eventJSON.fullNameStringedWithClock + ") --- START");
  //console.log("eventJSON = " + JSON.stringify(eventJSON).substring(0, 100) + " (...)");
  //console.log('event = ' + eventJSON.fullNameStringedWithClock);
  var retorno = { eventsToShow: [], eventsOnlyGoals: [], eventsOnlyRedCards: [], goals: { home: [], away: [] } };
  const getEventMinute = (eventText) => {
    var minute = eventText.substring(0, eventText.indexOf("'"));
    // adjusting minute for a goal at stopagge time
    if (minute.indexOf("+")) {
      var minutePart1 = Number(minute.substring(0, minute.indexOf("+")));
      var minutePart2 = Number(minute.substring(minute.indexOf("+") + 1, minute.length));
      minute = minutePart1 + minutePart2;
    } else {
      minute = Number(eventText.substring(0, eventText.indexOf("'")));
    }
    return minute;
  };
  const getEventMinuteSequential = (eventMinute, halfTimeEnded) => {
    // minute sequential is a 5 digit number starting with 1 or 2 (for HT or 2T), and the other 4 digits meaning Minute and seconds of event
    return !halfTimeEnded ? 10000 + (eventMinute - 1) * 100 : 20000 + (eventMinute - 46) * 100;
    // testing....
    // event.minuteToShow = event.minuteSequential;
  };
  const getEventBrClock = (eventMinute, halfTimeEnded) => {
    return !halfTimeEnded ? "1T " + eventMinute + ":00" : "2T " + (eventMinute - 45) + ":00";
  };
  const getPackageMinuteAllAndBrClock = (event, halfTimeEnded) => {
    event.minute = getEventMinute(event.text);
    event.minuteToShow = event.minute + "'";
    event.minuteSequential = getEventMinuteSequential(event.minute, halfTimeEnded);
    event.brClock = getEventBrClock(event.minute, halfTimeEnded);
  };

  if (eventJSON.events) {
    var homeNameToUse = eventJSON["o_home"] ? eventJSON.o_home.name : eventJSON.home.name;
    var awayNameToUse = eventJSON["o_away"] ? eventJSON.o_away.name : eventJSON.away.name;
    var halfTimeEnded = false;
    for (var event of eventJSON.events) {
      //console.log(`event = ${JSON.stringify(event)}`)
      // console.log(`event.text = ${event.text}`)
      var addToReturn = false;
      if (event.text) {
        if (event.text.indexOf("Corner -") > -1) {
          event.symbolToShow = "⛳"; // ⛳🚩🏁🏴🏳‍🌈🏳
          addToReturn = true;
          getPackageMinuteAllAndBrClock(event, halfTimeEnded);
          //event.minuteToShow = event.text.substring(0, 3);
        } else if (event.text.indexOf("Shot On Target -") > -1) {
          event.symbolToShow = "🎯";
          addToReturn = true;
          getPackageMinuteAllAndBrClock(event, halfTimeEnded);
          //event.minuteToShow = event.text.substring(0, 3);
        } else if (event.text.indexOf("Shot Off Target -") > -1) {
          event.symbolToShow = "🥾";
          addToReturn = true;
          getPackageMinuteAllAndBrClock(event, halfTimeEnded);
          //event.minuteToShow = event.text.substring(0, 3);
        } else if (event.text.indexOf("Goal -") > -1) {
          event.symbolToShow = "⚽";
          addToReturn = true;
          getPackageMinuteAllAndBrClock(event, halfTimeEnded);
        } else if (event.text.indexOf("Yellow Card -") > -1) {
          event.symbolToShow = "🟨";
          addToReturn = true;
          getPackageMinuteAllAndBrClock(event, halfTimeEnded);
          // event.minuteToShow = event.text.substring(0, 3);
        } else if (event.text.indexOf("Red Card -") > -1) {
          event.symbolToShow = "🟥";
          addToReturn = true;
          getPackageMinuteAllAndBrClock(event, halfTimeEnded);
          //event.minuteToShow = event.text.substring(0, 3);
        } else if (event.text.indexOf("First Half -") > -1) {
          event.symbolToShow = event.text.substring(event.text.indexOf("First Half -") + "First Half -".length, event.text.length);
          // event.symbolToShow = '➖'
          addToReturn = true;
          event.minuteToShow = "HT";
          halfTimeEnded = true;
        } else if (event.text.indexOf("Full Time -") > -1) {
          event.symbolToShow = event.text.substring(event.text.indexOf("Full Time -") + "Full Time -".length, event.text.length);
          // event.symbolToShow = '➖'
          addToReturn = true;
          event.minuteToShow = "FT";
        }

        if (event.text.indexOf(homeNameToUse) > -1) {
          event.homeOrAway = "H";
        } else if (event.text.indexOf(awayNameToUse) > -1) {
          event.homeOrAway = "A";
        } else {
          event.homeOrAway = "-";
        }

        if (addToReturn) {
          retorno.eventsToShow.push(event);
          //console.log("event to add = " + event.text);
          if (event.symbolToShow === "⚽️") {
            retorno.eventsOnlyGoals.push(event);
            retorno.goals[event.homeOrAway === "H" ? "home" : "away"].push({
              id: event.id,
              text: event.text,
              minute: Number(event.minuteToShow.substring(0, event.minuteToShow.indexOf("'"))),
              homeOrAway: event.homeOrAway === "H" ? "H" : "A",
            });
          }
          if (event.symbolToShow === "🟥") {
            retorno.eventsOnlyRedCards.push(event);
          }
        } else {
          // retorno.push(event) // NAO ADD SE addToReturn === FALSE
        }
      } else {
        console.log(`event.text is null, don't add to return`);
      }
    }
  } else {
    //console.log("arrangeEventsToShow(eventJSON) --- no events in this match occurred yet");
  }
  // console.log('retorno = '+retorno)
  //console.log("retorno.eventsOnlyGoals = " + JSON.stringify(retorno.eventsOnlyGoals));
  //console.log("retorno.goals = " + JSON.stringify(retorno.goals));
  //console.log("arrangeEventsToShow(" + eventJSON.fullNameStringedWithClock + ") --- START");
  return retorno;
}

function getMinuteClock(gameJSON) {
  // 20jun21
  const event = {
    timer: {
      // minuto 91 com 6 de acrescimo
      tm: 91, // TMR_MINS = MINUTE
      ts: 12, // TMR_SECS = SECOND
      tt: "1", // TMR_TICKING = timer is ticking true or false
      ta: 6, // TIME_ADDED = time added (acréscimos, stoppage time)
      md: 1, // MATCHLIVE_PERIOD = 0:ht 1:2t 2:overtime?? 3:penalties??
    },
  };
  var timerJSON = gameJSON.timer;

  var retorno = "pre-jogo";
  if (timerJSON) {
    if (timerJSON.tm !== null && timerJSON.ts !== null) {
      var minute = timerJSON.tm + 1;
      // var second = timerJSON.ts;
    } else {
      var minute = 0;
      // var second = 'ss';
    }

    //    if (second < 10) {
    //second = '0' + second;
    //}

    //if (gameJSON.scores[1]){
    if (gameJSON.timer.md == 1) {
      // 1T encerrado: second half or intervalo
      if (timerJSON.tt == "0") {
        if (minute > 75) {
          // há um bug quando o um jogo termina ele fica um tempo md=1, tm=90, tt=0 ts=0 ta=0 TALVEZ Não seja bug, simplesmente jogo no Overtime?? mas pode ser bug sim
          retorno = "FT";
        } else {
          retorno = "intervalo";
        }
      } else {
        //retorno = '2T' + ' ' + (minute - 45) + ":" + second;
        if (minute > 90) {
          retorno = "" + "90" + "+'";
        } else {
          retorno = "" + minute + "'";
        }
      }
    } else if (gameJSON.timer.md > 1) {
      // overtime and penalties must be considered here in the future
      retorno = "FT";
    } else {
      // 1T não terminou: still first half or match did not start
      if (timerJSON.tt == "0") {
        retorno = "pre-jogo";
      } else {
        //retorno = '1T' + ' ' + minute + ":" + second;
        if (minute > 45) {
          retorno = "" + "45" + "+'";
        } else {
          retorno = "" + minute + "'";
        }
      }
    }
  }
  if (gameJSON.time_status == "3") {
    retorno = "FT";
  }
  // } else {
  // retorno = 'erroClock';
  // }
  return retorno;
}

function translateEventMinuteClockToEnglish($minuteClock) {
  // 28abr2021
  if ($minuteClock) {
    $minuteClock = $minuteClock.toUpperCase();
    if ($minuteClock === "PRE-JOGO") return "pre-game";
    if ($minuteClock === "INTERVALO") return "half-time";
    if ($minuteClock === "FT") return "FT";
  }
  return $minuteClock;
}

function translateEventBRClockToEnglish($brClock) {
  // 28abr2021
  if ($brClock) {
    $brClock = $brClock.toUpperCase();
    if ($brClock === "PRE-JOGO") return "pre-game";
    if ($brClock === "INTERVALO") return "half-time";
    if ($brClock === "FT") return "FT";
    if ($brClock.indexOf("1T") > -1) {
      return $brClock.replace("1T", "1st");
    }
    if ($brClock.indexOf("2T") > -1) {
      return $brClock.replace("2T", "2nd");
    }
  }
  return $brClock;
}

export function getBSFdefaultInplayEventV3DataFromBFevent(bfEv) {
  return {
    //{ "event": { "id": "31614866", "name": "Almirante Brown v CD Maipu", "countryCode": "AR", "timezone": "GMT", "openDate": "2022-07-27T23:02:02.000Z" },
    id: "fakeBSFevent_bfid_" + bfEv.event.id,
    sport_id: "1",
    time: "1658964600",
    time_status: "0",
    league: { id: "leagueId", name: "leagueName", cc: bfEv.event.countryCode },
    home: {
      id: "id_home",
      name: bfEv.event.name.substring(0, bfEv.event.name.indexOf(` v `)),
      image_id: "0",
      cc: bfEv.event.countryCode,
    },
    away: {
      id: "id_away",
      name: bfEv.event.name.substring(bfEv.event.name.indexOf(` v `) + 3, bfEv.event.name.length),
      image_id: "0",
      cc: bfEv.event.countryCode,
    },
    ss: "0-0",
    scores: { 2: { home: "0", away: "0" } },
    bet365_id: "122693930",
    timer: { tm: 0, ts: 0, tt: 0, ta: 0, md: 0 },
    stats: {
      attacks: ["0", "0"],
      corners: ["0", "0"],
      dangerous_attacks: ["0", "0"],
      goals: ["0", "0"],
      off_target: ["0", "0"],
      on_target: ["0", "0"],
      penalties: ["0", "0"],
      possession_rt: ["0", "0"],
      redcards: ["0", "0"],
      substitutions: ["0", "0"],
      yellowcards: ["0", "0"],
    },
  };
}

export function parseBSFinplayEventV3FullDataToTremdgolUpcomingEvents(ev, bfEventsWithTremdgolUpcomingEventObject_Array) {
  const upComingEventData = bfEventsWithTremdgolUpcomingEventObject_Array.filter(
    (item) => item.tremdgolUpcomingEvent && item.tremdgolUpcomingEvent.id === ev.id
  )[0];
  if (upComingEventData) {
    console.log(upComingEventData.tremdgolUpcomingEvent.fullNameStringedWithClock);
    //console.error(ev);
    //console.error(upComingEventData.tremdgolUpcomingEvent.points);
    if (ev.stats.attacks) {
      upComingEventData.tremdgolUpcomingEvent.points.att_home = Number(ev.stats.attacks[0]);
      upComingEventData.tremdgolUpcomingEvent.points.att_away = Number(ev.stats.attacks[1]);
    }
    if (ev.stats.dangerous_attacks) {
      upComingEventData.tremdgolUpcomingEvent.points.datt_home = Number(ev.stats.dangerous_attacks[0]);
      upComingEventData.tremdgolUpcomingEvent.points.datt_away = Number(ev.stats.dangerous_attacks[1]);
    }
    if (ev.stats.goalattempts) {
      upComingEventData.tremdgolUpcomingEvent.points.goalattempts_home = Number(ev.stats.goalattempts[0]);
      upComingEventData.tremdgolUpcomingEvent.points.goalattempts_away = Number(ev.stats.goalattempts[1]);
    }
    if (ev.stats.on_target) {
      upComingEventData.tremdgolUpcomingEvent.points.on_target_home = Number(ev.stats.on_target[0]);
      upComingEventData.tremdgolUpcomingEvent.points.on_target_away = Number(ev.stats.on_target[1]);
    }
    if (ev.stats.off_target) {
      upComingEventData.tremdgolUpcomingEvent.points.off_target_home = Number(ev.stats.off_target[0]);
      upComingEventData.tremdgolUpcomingEvent.points.off_target_away = Number(ev.stats.off_target[1]);
    }
    if (ev.stats.possession_rt) {
      upComingEventData.tremdgolUpcomingEvent.points.possession_home = Number(ev.stats.possession_rt[0]);
      upComingEventData.tremdgolUpcomingEvent.points.possession_away = Number(ev.stats.possession_rt[1]);
    }
    parseEventData(upComingEventData.tremdgolUpcomingEvent);
    upComingEventData.tremdgolUpcomingEvent.timer = ev.timer;
    upComingEventData.tremdgolUpcomingEvent.enClock = ev.enClock;
    //console.error(JSON.stringify(ev.timer));
    //console.error(upComingEventData.tremdgolUpcomingEvent.enClock)
    //console.error(ev.enClock)
    /*
att_away_ht: 0
att_away_pct: 41
att_home: 55
att_home_ht: 0
att_home_pct: 59
corners_away: 1
corners_home: 4
datt_away: 10
datt_away_ht: 0
datt_away_pct: 30
datt_home: 23
datt_home_ht: 0
datt_home_pct: 70
datt_per_minute: 0.7
datt_per_minute_away: "0.22"
datt_per_minute_home: "0.50"
league_cc: "mx"
league_flag: "🇲🇽"
league_name: "Mexico Apertura"
off_target_away: 4
off_target_away_ht: 0
off_target_home: 5
off_target_home_ht: 0
on_target_away: 0
on_target_away_ht: 0
on_target_home: 5
on_target_home_ht: 0
placar_ft: "0-0"
pointsHistory: {dattHist: Array(75), attHist: Array(75)}
pointsIndex: "0.38"
pointsIndexColoredSymbol: "🟡"
pointsStringedWithBars: "||||||||||||-||||"
pointsStringedWithBars_away: "||||"
pointsStringedWithBars_home: "||||||||||||"
pointsStringedWithPeriod: "············x····"
points_away: "5.0"
points_away_2t: "5.0"
points_away_ht: "0.0"
points_home: "12.6"
points_home_2t: "12.6"
points_home_ht: "0.0"
possession_away: 35
possession_home: 65
power_index: "H➡️2.54"
power_index_2t: "H➡️2.54"
power_index_factor: 2.5353535353535355
power_index_ht: "H➡️NaN"
power_index_side: "H"
redcards_away: "0"
redcards_home: "0"
round: "5"
shots_off_in: "10-4 [5-0]"
shots_off_in_ht: "0-0 [0-0]"
table_position_away: "17"
table_position_home: "7"
totalDatt: 33
totalPoints: "17.5"
totalShots: 14
total_shots_away: 4
total_shots_away_ht: 0
total_shots_home: 10
total_shots_home_ht: 0
yellowcards_away: "0"
yellowcards_home: "2"
*/
  }
}

export function getPointsObjectFromBSFinplayEventV3(event) {
  let theReturn = {
    att_away: 0,
    att_away_ht: 0,
    att_away_pct: 0,
    att_home: 0,
    att_home_ht: 0,
    att_home_pct: 0,
    corners_away: 0,
    corners_home: 0,
    datt_away: 0,
    datt_away_ht: 0,
    datt_away_pct: 0,
    datt_home: 0,
    datt_home_ht: 0,
    datt_home_pct: 0,
    off_target_away: 0,
    off_target_away_ht: 0,
    off_target_home: 0,
    off_target_home_ht: 0,
    on_target_away: 0,
    on_target_away_ht: 0,
    on_target_home: 0,
    on_target_home_ht: 0,
  };
  if (event.stats) {
    if (event.stats.attacks) {
      theReturn.att_home = Number(event.stats.attacks[0]);
      theReturn.att_away = Number(event.stats.attacks[1]);
      theReturn.att_home_pct = Math.round((theReturn.att_home / (theReturn.att_home + theReturn.att_away)) * 100);
      theReturn.att_away_pct = Math.round((theReturn.att_away / (theReturn.att_home + theReturn.att_away)) * 100);
    }
    if (event.stats.dangerous_attacks) {
      theReturn.datt_home = Number(event.stats.dangerous_attacks[0]);
      theReturn.datt_away = Number(event.stats.dangerous_attacks[1]);
      theReturn.datt_home_pct = Math.round((theReturn.datt_home / (theReturn.datt_home + theReturn.datt_away)) * 100);
      theReturn.datt_away_pct = Math.round((theReturn.datt_away / (theReturn.datt_home + theReturn.datt_away)) * 100);
    }
    if (event.stats.goalattempts) {
      theReturn.goalattempts_home = Number(event.stats.goalattempts[0]);
      theReturn.goalattempts_away = Number(event.stats.goalattempts[1]);
    }
    if (event.stats.on_target) {
      theReturn.on_target_home = Number(event.stats.on_target[0]);
      theReturn.on_target_away = Number(event.stats.on_target[1]);
    }
    if (event.stats.off_target) {
      theReturn.off_target_home = Number(event.stats.off_target[0]);
      theReturn.off_target_away = Number(event.stats.off_target[1]);
    }
    if (event.stats.possession_rt) {
      theReturn.possession_home = Number(event.stats.possession_rt[0]);
      theReturn.possession_away = Number(event.stats.possession_rt[1]);
    }
  }
  return theReturn;
  /*
datt_per_minute_away: "0.22",
datt_per_minute_home: "0.50",
league_cc: "mx",
league_flag: "🇲🇽",
league_name: "Mexico Apertura",
placar_ft: "0-0"
pointsHistory: {dattHist: Array(75), attHist: Array(75)}
pointsIndex: "0.38"
pointsIndexColoredSymbol: "🟡"
pointsStringedWithBars: "||||||||||||-||||"
pointsStringedWithBars_away: "||||"
pointsStringedWithBars_home: "||||||||||||"
pointsStringedWithPeriod: "············x····"
points_away: "5.0"
points_away_2t: "5.0"
points_away_ht: "0.0"
points_home: "12.6"
points_home_2t: "12.6"
points_home_ht: "0.0"
possession_away: 35
possession_home: 65
power_index: "H➡️2.54"
power_index_2t: "H➡️2.54"
power_index_factor: 2.5353535353535355
power_index_ht: "H➡️NaN"
power_index_side: "H"
redcards_away: "0"
redcards_home: "0"
round: "5"
shots_off_in: "10-4 [5-0]"
shots_off_in_ht: "0-0 [0-0]"
table_position_away: "17"
table_position_home: "7"
totalDatt: 33
totalPoints: "17.5"
totalShots: 14
total_shots_away: 4
total_shots_away_ht: 0
total_shots_home: 10
total_shots_home_ht: 0
yellowcards_away: "0"
yellowcards_home: "2"
*/
}

export function getDemoEvents() {
  // some demo real events data from backups
  return [
    {
      id: "5928304",
      sport_id: "1",
      time: "1668960000",
      time_status: "1",
      league: {
        id: "250",
        name: "International Match",
        cc: null,
      },
      home: {
        id: "5107",
        name: "Gabon",
        image_id: "4761",
        cc: "ga",
      },
      away: {
        id: "169016",
        name: "Niger",
        image_id: "8031",
        cc: "ne",
      },
      ss: "0-0",
      timer: {
        tm: 17,
        ts: 26,
        tt: "1",
        ta: 0,
        md: 0,
      },
      scores: {
        2: {
          home: "0",
          away: "0",
        },
      },
      stats: {
        attacks: ["20", "17"],
        corners: ["3", "2"],
        dangerous_attacks: ["18", "10"],
        goals: ["0", "0"],
        off_target: ["1", "0"],
        on_target: ["0", "1"],
        penalties: ["0", "0"],
        redcards: ["0", "0"],
        substitutions: ["0", "0"],
        yellowcards: ["0", "0"],
      },
      extra: {
        length: "90",
      },
      events: [
        {
          id: "118651854",
          text: "3' - 1st Corner - Gabon",
          symbolToShow: "⛳️",
          minuteToShow: "3' ",
          homeOrAway: "H",
        },
        {
          id: "118652412",
          text: "6' - 2nd Corner - Niger",
          symbolToShow: "⛳️",
          minuteToShow: "6' ",
          homeOrAway: "A",
        },
        {
          id: "118652448",
          text: "7' - 3rd Corner - Niger",
          symbolToShow: "⛳️",
          minuteToShow: "7' ",
          homeOrAway: "A",
        },
        {
          id: "118653190",
          text: "11' - 4th Corner - Gabon",
          symbolToShow: "⛳️",
          minuteToShow: "11'",
          homeOrAway: "H",
        },
        {
          id: "118653747",
          text: "15' - 5th Corner - Gabon",
          symbolToShow: "⛳️",
          minuteToShow: "15'",
          homeOrAway: "H",
        },
        {
          id: "118653748",
          text: "15' - Race to 3 Corners - Gabon",
          homeOrAway: "H",
        },
      ],
      inplay_created_at: "1668959324",
      inplay_updated_at: "1668961263",
      bet365_id: "128553139",
      allSS: {
        eventView: {
          ss: "0-0",
          timer: {
            tm: 17,
            ts: 26,
            tt: "1",
            ta: 0,
            md: 0,
          },
          fullName: "Gabon x Niger",
        },
        inplayEvents_v1: {
          ss: "error",
          timer: "error",
          fullName: "error",
        },
        inplayEvents_v3: {
          ss: "error",
          timer: "error",
          fullName: "error",
        },
        inPlayEventsBSF: {
          ss: "0-0",
          timer: {
            tm: 17,
            ts: 20,
            tt: "1",
            ta: 0,
            md: 0,
          },
          fullName: "Gabon x Niger",
        },
      },
      score_ht: "",
      score_ft: "0-0",
      score: "0-0",
      totalGoals_home: 0,
      totalGoals_away: 0,
      totalGoals: 0,
      totalGoalsHT_home: 0,
      totalGoalsHT_away: 0,
      totalGoalsHT: 0,
      updated_at: "2022-11-20T16:21:13.320Z",
      brClock: "1T 17:26",
      minuteClock: "18'",
      enClock: "1st 17:26",
      clock: {
        brClock: "1T 17:26",
        period: "1T",
        minute: 17,
        second: 26,
      },
      fullName: "Gabon v Niger",
      fullName_fromBFdictionary: "Gabon v Niger",
      fullNameStringedWithClock: "Gabon 0-0 Niger (1T 17:26)",
      stringedGameWithRedcards: "Gabon 0-0 Niger",
      stringedGameWithRedcardsAndClock: "Gabon 0-0 Niger (1T 17:26)",
      stringedGameWithRedcardsAndClock_en: "Gabon 0-0 Niger (1st 17:26)",
      stringedGameWithRedcards_boldScore: "Gabon <b>0-0</b> Niger",
      minute: 18,
      tm_stats: {
        avg_age: [" ", " "],
        avg_market_value: [0, 0],
        club_members: [" ", " "],
        foreigners: [" ", " "],
        national_team_players: [" ", " "],
        total_market_value: [0, 0],
        youth_national_team_players: ["0", "0"],
      },
      bsf_inplay_endpoint_rawData_v1_thisEvent: null,
      bsf_inplay_endpoint_rawData_v1_thisEvent_date_of_insertion: "2022-11-20T16:21:13.583Z",
      bsf_inplay_endpoint_rawData_v3_thisEvent: null,
      bsf_inplay_endpoint_rawData_v3_thisEvent_date_of_insertion: "2022-11-20T16:21:13.583Z",
      points: {
        total_shots_home: 1,
        total_shots_away: 1,
        total_shots_home_ht: 0,
        total_shots_away_ht: 0,
        shots_off_in: "1-1 [0-1]",
        shots_off_in_ht: "0-0 [0-0]",
        totalPoints: "6.2",
        points_home: "3.3",
        points_away: "2.9",
        points_home_ht: "0.0",
        points_away_ht: "0.0",
        points_home_2t: "3.3",
        points_away_2t: "2.9",
        table_position_home: "",
        table_position_away: "",
        round: "",
        league_name: "International Match",
        league_cc: null,
        league_flag: "🏳",
        placar_ft: "0-0",
        datt_home: 18,
        datt_away: 10,
        datt_per_minute: 1.6,
        att_home: 20,
        att_away: 17,
        on_target_home: 0,
        on_target_away: 1,
        off_target_home: 1,
        off_target_away: 0,
        datt_home_ht: 0,
        datt_away_ht: 0,
        att_home_ht: 0,
        att_away_ht: 0,
        corners_home: "3",
        corners_away: "2",
        possession_home: 0,
        possession_away: 0,
        yellowcards_home: "0",
        yellowcards_away: "0",
        redcards_home: "0",
        redcards_away: "0",
        on_target_home_ht: 0,
        on_target_away_ht: 0,
        off_target_home_ht: 0,
        off_target_away_ht: 0,
        power_index_ht: "H➡️NaN",
        power_index: "H➡️1.16",
        power_index_side: "H",
        power_index_factor: 1.1578947368421053,
        power_index_2t: "H➡️1.16",
        pointsIndex: "0.34",
        pointsIndexColoredSymbol: "🟡",
        pointsStringedWithBars: "|||-||",
        pointsStringedWithPeriod: "···x··",
        pointsHistory: {
          dattHist: [
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 1,
              a: 0,
            },
            {
              m: 1,
              h: 3,
              a: 0,
            },
            {
              m: 2,
              h: 3,
              a: 0,
            },
            {
              m: 3,
              h: 7,
              a: 1,
            },
            {
              m: 4,
              h: 7,
              a: 1,
            },
            {
              m: 5,
              h: 7,
              a: 2,
            },
            {
              m: 6,
              h: 7,
              a: 5,
            },
            {
              m: 7,
              h: 9,
              a: 5,
            },
            {
              m: 8,
              h: 12,
              a: 5,
            },
            {
              m: 9,
              h: 12,
              a: 5,
            },
            {
              m: 10,
              h: 13,
              a: 5,
            },
            {
              m: 11,
              h: 15,
              a: 5,
            },
            {
              m: 12,
              h: 15,
              a: 7,
            },
            {
              m: 13,
              h: 15,
              a: 7,
            },
            {
              m: 14,
              h: 16,
              a: 8,
            },
            {
              m: 15,
              h: 17,
              a: 8,
            },
            {
              m: 16,
              h: 17,
              a: 10,
            },
            {
              m: 17,
              h: 18,
              a: 10,
            },
          ],
          attHist: [
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 1,
              a: 1,
            },
            {
              m: 1,
              h: 2,
              a: 1,
            },
            {
              m: 2,
              h: 3,
              a: 2,
            },
            {
              m: 3,
              h: 5,
              a: 3,
            },
            {
              m: 4,
              h: 6,
              a: 5,
            },
            {
              m: 5,
              h: 6,
              a: 5,
            },
            {
              m: 6,
              h: 6,
              a: 5,
            },
            {
              m: 7,
              h: 8,
              a: 7,
            },
            {
              m: 8,
              h: 9,
              a: 7,
            },
            {
              m: 9,
              h: 9,
              a: 8,
            },
            {
              m: 10,
              h: 11,
              a: 8,
            },
            {
              m: 11,
              h: 13,
              a: 10,
            },
            {
              m: 12,
              h: 14,
              a: 11,
            },
            {
              m: 13,
              h: 15,
              a: 13,
            },
            {
              m: 14,
              h: 16,
              a: 15,
            },
            {
              m: 15,
              h: 16,
              a: 15,
            },
            {
              m: 16,
              h: 17,
              a: 17,
            },
            {
              m: 17,
              h: 20,
              a: 17,
            },
          ],
        },
      },
      event_odds: {
        eventId_bsf: "5928304",
        isEndedEvent: 0,
        updated_at: "2022-11-20T16:21:00.185Z",
        source: "ZezinhoMicroserviceBSFbot",
        source_v: 21,
        odds_summary: {
          start: {
            home_odd: 1.615,
            draw_odd: 3.4,
            away_odd: 5,
            ss: null,
            t: null,
            add_time: "1668947177",
            home_prob: 61.9,
            draw_prob: 29.4,
            away_prob: 20,
            over_odd: 1.975,
            handicap: 2.25,
          },
          kickOff: {
            home_odd: 1.727,
            draw_odd: 3.1,
            away_odd: 5,
            ss: "0-0",
            t: "1",
            add_time: "1668960321",
            home_prob: 57.9,
            draw_prob: 32.3,
            away_prob: 20,
            over_odd: 2,
            handicap: 2,
          },
          end: {
            home_odd: 1.909,
            draw_odd: 2.875,
            away_odd: 5.5,
            ss: "0-0",
            t: "16",
            add_time: "1668961186",
            home_prob: 52.4,
            draw_prob: 34.8,
            away_prob: 18.2,
            over_odd: 1.925,
            handicap: 1.5,
          },
        },
        odds: {
          moneyLine_1_1: {
            last: {
              home_odd: "1.909",
              draw_odd: "2.875",
              away_odd: "5.500",
              ss: "0-0",
              time_str: "16",
              add_time: "1668961186",
            },
          },
          moneyLineHT_1_8: {
            last: {
              home_odd: "3.100",
              draw_odd: "1.615",
              away_odd: "7.500",
              ss: "0-0",
              time_str: "17",
              add_time: "1668961248",
            },
          },
          goal_line_1_3: {
            last: {
              over_odd: "1.925",
              handicap: "1.5",
              under_odd: "1.925",
              ss: "0-0",
              time_str: "17",
              add_time: "1668961248",
            },
          },
          ht_goal_line_1_6: {
            last: {
              over_odd: "2.125",
              handicap: "0.5",
              under_odd: "1.750",
              ss: "0-0",
              time_str: "16",
              add_time: "1668961186",
            },
          },
        },
        favorite_H_A: "H",
        favorite_odd: 1.727,
        favorite_category: 5,
        favorite_symbol: "★",
        overNextGolHT: 2.125,
        overNextGol: 1.21,
      },
      eventsToShow: [],
      eventsToShow_onlyGoals: [],
      eventsToShow_onlyRedCards: [],
      pointsSlices: {
        minutes_array: ["05'", "10'", "15'", "20'"],
        minutesToShow_array: ["🔴", "🟢", "🔴", "🔴"],
        minutesToShow_array2: ["-", "+", "-", "-"],
        minutesToShow_stringed: "🔴🟢🔴🔴",
        minutesToShow_stringed2: "- + - - ",
        minutesOfGoalsToShow_array: [0, 0, 0, 0],
        minutesOfHomeGoalsToShow_array: ["", "", "", ""],
        minutesOfAwayGoalsToShow_array: ["", "", "", ""],
        minutesOfHomeGoalsToShow_array_stringed: "▫️▫️▫️▫️",
        minutesOfAwayGoalsToShow_array_stringed: "▫️▫️▫️▫️",
        homeGoalsSlices: [],
        awayGoalsSlices: [],
        minutesOfRedCardsToShow_array: [],
        minutesOfHomeRedCardsToShow_array: ["", "", "", ""],
        minutesOfAwayRedCardsToShow_array: ["", "", "", ""],
        minutesOfHomeRedCardsAndGoalsToShow_array: ["", "", "", ""],
        minutesOfAwayRedCardsAndGoalsToShow_array: ["", "", "", ""],
        pointsSlices: [
          {
            slice_minute: 5,
            home_points: 1,
            away_points: 0.45,
            total_points: 1.45,
          },
          {
            slice_minute: 10,
            home_points: 0.85,
            away_points: 1.45,
            total_points: 2.3,
          },
          {
            slice_minute: 15,
            home_points: 0.65,
            away_points: 0.65,
            total_points: 1.3,
          },
          {
            slice_minute: 20,
            home_points: 0.8,
            away_points: 0.3,
            total_points: 1.1,
          },
        ],
        points_per_Minutes_Slices: ["0.29", "0.46", "0.26", "0.22"],
        home_slice_points_array: [1, 0.85, 0.65, 0.8],
        home_slice_points_array_zeroFilled: [1, 0.85, 0.65, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        home_slice_only_datt_points_array_zeroFilled: [7, 6, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        away_slice_points_array: [0.45, 1.45, 0.65, 0.3],
        away_slice_points_array_reverse: [-0.45, -1.45, -0.65, -0.3],
        away_slice_points_array_reverse_zeroFilled: [-0.45, -1.45, -0.65, -0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        away_slice_only_datt_points_array_reverse_zeroFilled: [-2, -3, -3, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        home_slice_points_array_stringed: "◾️▪️▪️▪️",
        away_slice_points_array_stringed: "▫️◾️▪️▫️",
        total_points_array: [1.45, 2.3, 1.3, 1.1],
        total_points_array_stringed: "1.4 2.3 1.3 1.1 ",
        goals_slices_array: [0, 0, 0, 0],
        powerIndex_array: [2.22, -1.71, -1, 2.67],
        powerIndexToShow_stringed: "⏩️◀️️️⏸⏩️",
        powerIndexToShow_stringed2: "➡◀️️️⏸➡",
        powerIndexToShow_stringed_home: "➡▫️⏸➡",
        powerIndexToShow_stringed_away: "▫️◀️️️⏸▫️",
        powerIndexToShow_stringed_HhAa: "H a = H ",
        powerIndexToShow_stringed_HhAa_merged: "H- a+ =- H- ",
        maxMinuteWithData: 16,
        points_per_min_color_symbols: "🟡 🟡 🟡 🟡 🟡",
        points_per_min_color_symbol: "🟡",
        total_points: 6.15,
        points_per_min: "0.38",
        points_per_min_color: "#daa520",
      },
      timeStamps: {
        time_stringed_ISO_8601: "2022-11-20T16:00:00.000Z",
        time_stringed_withZoneBR: "20/Nov 13:00 GMT-0300",
        timeUntilKickOff_stringed: "-21m",
      },
      bf_mostSimilarComparison: {
        eventMostSimilar: {
          id: "31924136",
          name: "Gabon v Niger",
          marketCount: "",
        },
        greaterSimilarityValue: 1,
        greaterSimilarityTop5Rank: [
          {
            eventName: "Gabon v Niger",
            eventId: "31924136",
            eventSimilarityValue: 1,
          },
          {
            eventName: "Luxembourg v Bulgaria",
            eventId: "31916385",
            eventSimilarityValue: 0.33,
          },
          {
            eventName: "Slovenia v Montenegro",
            eventId: "31916381",
            eventSimilarityValue: 0.33,
          },
          {
            eventName: "Hungary v Greece",
            eventId: "31916384",
            eventSimilarityValue: 0.31,
          },
          {
            eventName: "Chengdu Rongcheng v Shandong Taishan",
            eventId: "31921437",
            eventCc: "CN",
            eventSimilarityValue: 0.22,
          },
        ],
        bf_odds: {
          match_odds: {
            marketId: "1.206734225",
            marketName: "Match Odds",
            totalMatched: 635.41,
            home_odd: 1.76,
            draw_odd: 3.4,
            away_odd: 5.6,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-20T15:47:26.971Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_2_5: {
            marketId: "1.206734270",
            marketName: "Over/Under 2.5 Goals",
            totalMatched: 297.61,
            under_odd: 1.57,
            under_odd_lastPriceTraded: 1.68,
            over_odd: 2.56,
            over_odd_lastPriceTraded: 2.52,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-20T15:40:59.319Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_1_5: {
            marketId: "1.206734273",
            marketName: "Over/Under 1.5 Goals",
            totalMatched: 502.41,
            under_odd: 2.76,
            under_odd_lastPriceTraded: 2.86,
            over_odd: 1.51,
            over_odd_lastPriceTraded: 1.47,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-20T15:41:46.084Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_HT_0_5: {
            marketId: "1.206734228",
            marketName: "First Half Goals 0.5",
            totalMatched: 324.26,
            under_odd: 2.6,
            under_odd_lastPriceTraded: 2.68,
            over_odd: 1.58,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-20T15:41:31.963Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
        },
      },
      bf_mostSimilarComparison_Live: {
        eventMostSimilar: {
          id: "31924136",
          name: "Gabon v Niger",
          marketCount: 24,
        },
        totalInPlayEvents: 104,
        mostSimilarRankMaxLength: 5,
        greaterSimilarityValue: 1,
        greaterSimilarityRank: [
          {
            id: "31924136",
            name: "Gabon v Niger",
            sim_value: 1,
          },
          {
            id: "31921890",
            name: "Badalona v CE Europa",
            cc: "ES",
            sim_value: 0.4,
          },
          {
            id: "31921887",
            name: "CD Cayon v UC Cartes",
            cc: "ES",
            sim_value: 0.35,
          },
          {
            id: "31348645",
            name: "Qatar v Ecuador",
            sim_value: 0.35,
          },
          {
            id: "31923603",
            name: "St Jakob Ros v Svg Bleiburg",
            cc: "AT",
            sim_value: 0.35,
          },
        ],
      },
      bfOdds_fromPropertieCache: {
        bsf_id: "5928304",
        bsf_fullName: "Gabon v Niger",
        bsf_time: "1668960000",
        bfEventId: "31924136",
        bf_eventName: "Gabon v Niger",
        bf_homeOdd_pregame: 1.76,
        bf_drawOdd_pregame: 3.4,
        bf_awayOdd_pregame: 5.6,
        bf_overOdd2_5_pregame: 2.56,
        bf_overOdd0_5HT_pregame: 1.58,
      },
      textsToShow: {
        overOdds: {
          eventOddsSummaryTextMsgParsedToSend_ML: "1.73|3|5.0",
          eventOddsSummaryTextMsgParsedToSend_GoalLine: " 2.25@2.0",
          eventOddsTextMsgParsedToSend_GoalLine: " 1.5@1.9 (1.21)",
          eventOddsTextMsgParsedToSend_GoalLineHT: "0.5ht@2.1 (2.13)",
        },
        bfUpcomingEventOdds: "2.5@2.56 0.5ht@1.58",
        pointsStringedWithFavoriteSymbol: "  ★···x··",
      },
      eventTextMsgParsedToSendWithTeamOdds:
        "\n(1T 17:26)  <code>1.909</code> Gabon <b>0-0</b> Niger <code>5.5</code>  [5928304] \n6.2 [3 v 3]  1🥅1  0🎯1   18💥10 (1.6)   0%0  0.34🟡  H➡️1.16\n1.73|3|5.0  2.25@2.0  ⚽ 1.5@1.9 (1.21)   0.5ht@2.1 (2.13) bf{2.5@2.56 0.5ht@1.58}  ★···x··\n🔴🟢🔴🔴\n▫️▫️▫️▫️\n◾️▪️▪️▪️\n▫️◾️▪️▫️\n▫️▫️▫️▫️\n",
      has_selected_team: false,
      selectedTeam: {
        has_selected_team: false,
        selected_team_homeOrAway: "",
        team: {},
        odd: 0,
      },
      selectedTeamMaxOdd: {
        has_selected_team: false,
        selected_team_homeOrAway: "",
        team: {},
        odd: 0,
      },
      bsfEventsHistory: {
        h2h: [],
        home: [],
        away: [],
        last10stats: {
          h2h: {
            total: 0,
            totalGoals: 0,
            o0_5: 0,
            o1_5: 0,
            o2_5: 0,
            o3_5: 0,
            o0_5ht: 0,
            o1_5ht: 0,
            o2_5ht: 0,
            o0_52t: 0,
            o1_52t: 0,
            o2_52t: 0,
            gols1t: 0,
            gols2t: 0,
            gols1t_pct: 0,
            gols2t_pct: 0,
          },
          home: {
            total: 0,
            totalGoals: 0,
            o0_5: 0,
            o1_5: 0,
            o2_5: 0,
            o3_5: 0,
            o0_5ht: 0,
            o1_5ht: 0,
            o2_5ht: 0,
            o0_52t: 0,
            o1_52t: 0,
            o2_52t: 0,
            gols1t: 0,
            gols2t: 0,
            gols1t_pct: 0,
            gols2t_pct: 0,
            scored: 0,
            cleanSheet: 0,
          },
          away: {
            total: 0,
            totalGoals: 0,
            o0_5: 0,
            o1_5: 0,
            o2_5: 0,
            o3_5: 0,
            o0_5ht: 0,
            o1_5ht: 0,
            o2_5ht: 0,
            o0_52t: 0,
            o1_52t: 0,
            o2_52t: 0,
            gols1t: 0,
            gols2t: 0,
            gols1t_pct: 0,
            gols2t_pct: 0,
            scored: 0,
            cleanSheet: 0,
          },
        },
      },
      bf_odds_live: {
        match_odds: {
          marketId: "1.206734225",
          marketName: "Match Odds",
          totalMatched: 2456.23,
          home_odd: 1.96,
          draw_odd: 3,
          away_odd: 5.6,
          isMarketDataDelayed: true,
          betDelay: 5,
          lastMatchTime: "2022-11-20T16:17:31.976Z",
          status: "OPEN",
          runners_status: "ACTIVE",
        },
        over_under_2_5: {
          marketId: "1.206734270",
          marketName: "Over/Under 2.5 Goals",
          totalMatched: 3318.89,
          under_odd: 1.31,
          under_odd_lastPriceTraded: 1.35,
          over_odd: 3.9,
          over_odd_lastPriceTraded: 3.9,
          isMarketDataDelayed: true,
          betDelay: 5,
          lastMatchTime: "2022-11-20T16:20:19.906Z",
          status: "OPEN",
          runners_status: "ACTIVE",
        },
        over_under_0_5_HT: {
          marketId: "1.206734228",
          marketName: "First Half Goals 0.5",
          totalMatched: 1993.22,
          under_odd: 1.88,
          under_odd_lastPriceTraded: 1.98,
          over_odd: 2.06,
          isMarketDataDelayed: true,
          betDelay: 5,
          lastMatchTime: "2022-11-20T16:18:36.028Z",
          status: "OPEN",
          runners_status: "ACTIVE",
          over_odd_lastPriceTraded: 2.02,
        },
      },
      bf_odds_live_history: {
        match_odds: {
          marketId: "1.206734225",
          history: [
            {
              m: 0,
              h: 1.76,
              d: 3.4,
              a: 5.6,
            },
            {
              m: 0,
              h: 1.76,
              d: 3.4,
              a: 5.6,
            },
            {
              m: 0,
              h: 1.76,
              d: 3.4,
              a: 5.6,
            },
            {
              m: 0,
              h: 1.77,
              d: 3.4,
              a: 5.5,
            },
            {
              m: 0,
              h: 1.77,
              d: 3.4,
              a: 5.5,
            },
            {
              m: 0,
              h: 1.77,
              d: 3.4,
              a: 5.5,
            },
            {
              m: 0,
              h: 1.77,
              d: 3.4,
              a: 5.5,
            },
            {
              m: 0,
              h: 1.77,
              d: 3.4,
              a: 5.5,
            },
            {
              m: 0,
              h: 1.77,
              d: 3.4,
              a: 5.5,
            },
            {
              m: 0,
              h: 1.8,
              d: 3.4,
              a: 5.4,
            },
            {
              m: 0,
              h: 1.79,
              d: 3.35,
              a: 5.3,
            },
            {
              m: 0,
              h: 1.75,
              d: 3.35,
              a: 5.2,
            },
            {
              m: 0,
              h: 1.78,
              d: 3.15,
              a: 3.65,
            },
            {
              m: 1,
              h: 1.78,
              d: 3.15,
              a: 3.65,
            },
            {
              m: 2,
              h: 1.01,
              d: 1.02,
              a: 1.01,
            },
            {
              m: 3,
              h: 1.67,
              d: 3.35,
              a: 5.8,
            },
            {
              m: 4,
              h: 1.67,
              d: 3.35,
              a: 5.8,
            },
            {
              m: 5,
              h: 1.01,
              d: 3.25,
              a: 5.8,
            },
            {
              m: 6,
              h: 1.85,
              d: 3.3,
              a: 5.5,
            },
            {
              m: 7,
              h: 1.86,
              d: 3.25,
              a: 5.7,
            },
            {
              m: 8,
              h: 1.84,
              d: 3.3,
              a: 5.6,
            },
            {
              m: 9,
              h: 1.2,
              d: 3.3,
              a: 5.6,
            },
            {
              m: 10,
              h: 1.85,
              d: 3.3,
              a: 5.6,
            },
            {
              m: 11,
              h: 1.19,
              d: 3.1,
              a: 5.7,
            },
            {
              m: 12,
              h: 1.94,
              d: 3,
              a: 5.5,
            },
            {
              m: 13,
              h: 1.19,
              d: 3.1,
              a: 5.7,
            },
            {
              m: 14,
              h: 1.93,
              d: 3.05,
              a: 5.7,
            },
            {
              m: 15,
              h: 1.83,
              d: 3.05,
              a: 5.6,
            },
            {
              m: 16,
              h: 1.93,
              d: 3.05,
              a: 5.6,
            },
            {
              m: 17,
              h: 1.94,
              d: 3.05,
              a: 5.6,
            },
            {
              m: 18,
              h: 1.96,
              d: 3,
              a: 5.6,
            },
          ],
        },
        over_under_2_5: {
          marketId: "1.206734270",
          history: [
            {
              m: 0,
              o: 2.56,
              u: 1.57,
            },
            {
              m: 0,
              o: 2.58,
              u: 1.57,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.57,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.54,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.54,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.56,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.56,
            },
            {
              m: 0,
              o: 1.63,
              u: 1.56,
            },
            {
              m: 1,
              o: 1.63,
              u: 1.56,
            },
            {
              m: 2,
              o: 1.63,
              u: 1.56,
            },
            {
              m: 3,
              o: 2.7,
              u: 1.52,
            },
            {
              m: 4,
              o: 1.01,
              u: 1.2,
            },
            {
              m: 5,
              o: 1.01,
              u: 1.2,
            },
            {
              m: 6,
              o: 2.98,
              u: 1.47,
            },
            {
              m: 7,
              o: 2.04,
              u: 1.52,
            },
            {
              m: 8,
              o: 1.01,
              u: 1.5,
            },
            {
              m: 9,
              o: 2.04,
              u: 1.5,
            },
            {
              m: 10,
              o: 2.04,
              u: 1.52,
            },
            {
              m: 11,
              o: 2.04,
              u: 1.34,
            },
            {
              m: 12,
              o: 3.45,
              u: 1.37,
            },
            {
              m: 13,
              o: 3.4,
              u: 1.38,
            },
            {
              m: 14,
              o: 3.45,
              u: 1.37,
            },
            {
              m: 15,
              o: 3.65,
              u: 1.34,
            },
            {
              m: 16,
              o: 3.4,
              u: 1.35,
            },
            {
              m: 17,
              o: 2.36,
              u: 1.34,
            },
            {
              m: 18,
              o: 3.9,
              u: 1.31,
            },
          ],
        },
        over_under_0_5_HT: {
          marketId: "1.206734228",
          history: [
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 0,
              o: 1.57,
              u: 2.62,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.62,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.42,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.42,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.42,
            },
            {
              m: 1,
              o: 1.58,
              u: 2.48,
            },
            {
              m: 2,
              o: 1.58,
              u: 2.48,
            },
            {
              m: 3,
              o: 1.58,
              u: 2.48,
            },
            {
              m: 4,
              o: 1.65,
              u: 2.42,
            },
            {
              m: 5,
              o: 1.58,
              u: 2.44,
            },
            {
              m: 6,
              o: 1.58,
              u: 2.44,
            },
            {
              m: 7,
              o: 1.67,
              u: 2.42,
            },
            {
              m: 8,
              o: 1.64,
              u: 2.44,
            },
            {
              m: 9,
              o: 1.58,
              u: 2.42,
            },
            {
              m: 10,
              o: 1.73,
              u: 2.3,
            },
            {
              m: 11,
              o: 1.74,
              u: 2.3,
            },
            {
              m: 12,
              o: 1.73,
              u: 2.3,
            },
            {
              m: 13,
              o: 1.92,
              u: 2,
            },
            {
              m: 14,
              o: 1.88,
              u: 2.06,
            },
            {
              m: 15,
              o: 2.02,
              u: 1.92,
            },
            {
              m: 16,
              o: 2,
              u: 1.93,
            },
            {
              m: 17,
              o: 2.08,
              u: 1.85,
            },
            {
              m: 18,
              o: 2.06,
              u: 1.88,
            },
          ],
        },
      },
      bsf_odds_live_history: {
        match_odds: {
          history: [
            {
              m: 0,
              ss: 0,
            },
            {
              m: 0,
              ss: 0,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 0,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 1,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 2,
              h: "1.666",
              d: "3.100",
              a: "5.000",
              ss: null,
            },
            {
              m: 3,
              h: "-",
              d: "-",
              a: "-",
              ss: "0-0",
            },
            {
              m: 4,
              h: "1.800",
              d: "3.200",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 5,
              h: "1.800",
              d: "3.200",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 6,
              h: "1.800",
              d: "3.200",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 7,
              h: "1.833",
              d: "3.200",
              a: "4.750",
              ss: "0-0",
            },
            {
              m: 8,
              h: "1.833",
              d: "3.100",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 9,
              h: "1.833",
              d: "3.100",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 10,
              h: "1.833",
              d: "3.100",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 11,
              h: "1.727",
              d: "3.200",
              a: "5.500",
              ss: "0-0",
            },
            {
              m: 12,
              h: "1.833",
              d: "3.000",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 13,
              h: "1.833",
              d: "3.000",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 14,
              h: "1.833",
              d: "3.000",
              a: "5.500",
              ss: "0-0",
            },
            {
              m: 15,
              h: "1.833",
              d: "3.000",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 16,
              h: "1.833",
              d: "2.875",
              a: "5.500",
              ss: "0-0",
            },
            {
              m: 17,
              h: "1.833",
              d: "2.875",
              a: "5.500",
              ss: "0-0",
            },
            {
              m: 18,
              h: "1.909",
              d: "2.875",
              a: "5.500",
              ss: "0-0",
            },
          ],
        },
        match_odds_HT: {
          history: [
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 0,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 1,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 2,
              h: "2.500",
              d: "1.952",
              a: "6.000",
              ss: null,
            },
            {
              m: 3,
              h: "-",
              d: "-",
              a: "-",
              ss: "0-0",
            },
            {
              m: 4,
              h: "2.500",
              d: "1.952",
              a: "6.500",
              ss: "0-0",
            },
            {
              m: 5,
              h: "2.500",
              d: "1.952",
              a: "6.500",
              ss: "0-0",
            },
            {
              m: 6,
              h: "2.625",
              d: "1.909",
              a: "6.000",
              ss: "0-0",
            },
            {
              m: 7,
              h: "2.625",
              d: "1.909",
              a: "5.500",
              ss: "0-0",
            },
            {
              m: 8,
              h: "2.625",
              d: "1.833",
              a: "6.500",
              ss: "0-0",
            },
            {
              m: 9,
              h: "2.625",
              d: "1.833",
              a: "6.500",
              ss: "0-0",
            },
            {
              m: 10,
              h: "2.625",
              d: "1.833",
              a: "6.500",
              ss: "0-0",
            },
            {
              m: 11,
              h: "2.750",
              d: "1.800",
              a: "6.500",
              ss: "0-0",
            },
            {
              m: 12,
              h: "2.875",
              d: "1.727",
              a: "7.000",
              ss: "0-0",
            },
            {
              m: 13,
              h: "2.875",
              d: "1.727",
              a: "7.000",
              ss: "0-0",
            },
            {
              m: 14,
              h: "2.875",
              d: "1.666",
              a: "7.000",
              ss: "0-0",
            },
            {
              m: 15,
              h: "3.000",
              d: "1.666",
              a: "7.000",
              ss: "0-0",
            },
            {
              m: 16,
              h: "3.000",
              d: "1.666",
              a: "7.000",
              ss: "0-0",
            },
            {
              m: 17,
              h: "3.100",
              d: "1.615",
              a: "7.000",
              ss: "0-0",
            },
            {
              m: 18,
              h: "3.100",
              d: "1.615",
              a: "7.500",
              ss: "0-0",
            },
          ],
        },
      },
      tips: [],
    },
    {
      id: "5920589",
      sport_id: "1",
      time: "1668870000",
      time_status: "1",
      league: {
        id: "1789",
        name: "France Cup",
        cc: "fr",
      },
      home: {
        id: "56518",
        name: "Haguenau",
        image_id: "32493",
        cc: "fr",
      },
      away: {
        id: "5181",
        name: "ASM Belfort",
        image_id: "86364",
        cc: "fr",
      },
      ss: "1-1",
      timer: {
        tm: 55,
        ts: 18,
        tt: "1",
        ta: 0,
        md: 1,
      },
      scores: {
        1: {
          home: "1",
          away: "1",
        },
        2: {
          home: "1",
          away: "1",
        },
      },
      stats: {
        attacks: ["74", "56"],
        ball_safe: ["102", "141"],
        corners: ["3", "1"],
        corner_h: ["2", "1"],
        dangerous_attacks: ["41", "21"],
        goals: ["1", "1"],
        injuries: ["0", "1"],
        off_target: ["3", "0"],
        on_target: ["3", "2"],
        penalties: ["0", "0"],
        redcards: ["0", "0"],
        substitutions: ["1", "1"],
        yellowcards: ["2", "3"],
        yellowred_cards: ["0", "0"],
      },
      extra: {
        length: 90,
        away_manager: {
          id: "143564",
          name: "Anthony Hacquard",
          cc: "fr",
        },
        numberofperiods: "2",
        periodlength: "45",
        round: "37",
      },
      events: [
        {
          id: "118486430",
          text: "6' - 1st Offside- ASM Belfort",
          homeOrAway: "A",
        },
        {
          id: "118486902",
          text: "9' - 1st Corner - Haguenau",
          symbolToShow: "⛳️",
          minuteToShow: "9' ",
          homeOrAway: "H",
        },
        {
          id: "118487129",
          text: "10' - 1st Yellow Card -  (ASM Belfort)",
          symbolToShow: "🟨",
          homeOrAway: "A",
        },
        {
          id: "118487753",
          text: "12' - 2nd Offside- ASM Belfort",
          homeOrAway: "A",
        },
        {
          id: "118490008",
          text: "20' - 2nd Corner - ASM Belfort",
          symbolToShow: "⛳️",
          minuteToShow: "20'",
          homeOrAway: "A",
        },
        {
          id: "118490234",
          text: "21' - 1st Goal -   (ASM Belfort) -",
          symbolToShow: "⚽️",
          minuteToShow: "21'",
          minuteSequential: 12000,
          brClock: "1T 21:00",
          homeOrAway: "A",
        },
        {
          id: "118490536",
          text: "22' - 3rd Corner - Haguenau",
          symbolToShow: "⛳️",
          minuteToShow: "22'",
          homeOrAway: "H",
        },
        {
          id: "118491536",
          text: "27' - 3rd Offside- Haguenau",
          homeOrAway: "H",
        },
        {
          id: "118491915",
          text: "30' - 2nd Goal -   (Haguenau) -",
          symbolToShow: "⚽️",
          minuteToShow: "30'",
          minuteSequential: 12900,
          brClock: "1T 30:00",
          homeOrAway: "H",
        },
        {
          id: "118492188",
          text: "31' - 4th Offside- Haguenau",
          homeOrAway: "H",
        },
        {
          id: "118492691",
          text: "34' - 2nd Yellow Card -  (Haguenau)",
          symbolToShow: "🟨",
          homeOrAway: "H",
        },
        {
          id: "118492871",
          text: "35' - 3rd Yellow Card -  (ASM Belfort)",
          symbolToShow: "🟨",
          homeOrAway: "A",
        },
        {
          id: "118493154",
          text: "36' - 4th Yellow Card -  (ASM Belfort)",
          symbolToShow: "🟨",
          homeOrAway: "A",
        },
        {
          id: "118493463",
          text: "38' - 5th Yellow Card -  (Haguenau)",
          symbolToShow: "🟨",
          homeOrAway: "H",
        },
        {
          id: "118495521",
          text: "Score After First Half - 1-1",
          symbolToShow: " 1-1",
          minuteToShow: "HT",
          homeOrAway: "-",
        },
        {
          id: "118499686",
          text: "52' - 4th Corner - Haguenau",
          symbolToShow: "⛳️",
          minuteToShow: "52'",
          homeOrAway: "H",
        },
        {
          id: "118499687",
          text: "52' - Race to 3 Corners - Haguenau",
          homeOrAway: "H",
        },
      ],
      has_lineup: 0,
      inplay_created_at: "1668869572",
      inplay_updated_at: "1668874509",
      confirmed_at: "1668873828",
      bet365_id: "128323486",
      tm_stats: {
        avg_age: ["26.5", "26.2"],
        avg_market_value: [0, 0],
        foreigners: ["4", "1"],
        national_team_players: ["0", "0"],
        total_market_value: [0, 0],
        youth_national_team_players: ["0", "0"],
      },
      missingplayers: {
        home: [],
        away: [],
      },
      allSS: {
        eventView: {
          ss: "1-1",
          timer: {
            tm: 55,
            ts: 18,
            tt: "1",
            ta: 0,
            md: 1,
          },
          fullName: "Haguenau x ASM Belfort",
        },
        inplayEvents_v1: {
          ss: "error",
          timer: "error",
          fullName: "error",
        },
        inplayEvents_v3: {
          ss: "error",
          timer: "error",
          fullName: "error",
        },
        inPlayEventsBSF: {
          ss: "1-1",
          timer: {
            tm: 55,
            ts: 27,
            tt: "1",
            ta: 0,
            md: 1,
          },
          fullName: "Haguenau x ASM Belfort",
        },
      },
      score_ht: "1-1",
      score_ft: "1-1",
      score: "1-1 (1-1)",
      totalGoals_home: 1,
      totalGoals_away: 1,
      totalGoals: 2,
      totalGoalsHT_home: 1,
      totalGoalsHT_away: 1,
      totalGoalsHT: 2,
      updated_at: "2022-11-19T16:15:20.497Z",
      brClock: "2T 10:18",
      minuteClock: "56'",
      enClock: "2nd 10:18",
      clock: {
        brClock: "2T 10:18",
        period: "2T",
        minute: 10,
        second: 18,
      },
      fullName: "Haguenau v ASM Belfort",
      fullName_fromBFdictionary: "Haguenau v ASM Belfort",
      fullNameStringedWithClock: "Haguenau 1-1 ASM Belfort (2T 10:18)",
      stringedGameWithRedcards: "Haguenau 1-1 (1-1) ASM Belfort",
      stringedGameWithRedcardsAndClock: "Haguenau 1-1 (1-1) ASM Belfort (2T 10:18)",
      stringedGameWithRedcardsAndClock_en: "Haguenau 1-1 (1-1) ASM Belfort (2nd 10:18)",
      stringedGameWithRedcards_boldScore: "Haguenau <b>1-1 (1-1)</b> ASM Belfort",
      minute: 56,
      bsf_inplay_endpoint_rawData_v1_thisEvent: null,
      bsf_inplay_endpoint_rawData_v1_thisEvent_date_of_insertion: "2022-11-19T16:15:20.906Z",
      bsf_inplay_endpoint_rawData_v3_thisEvent: null,
      bsf_inplay_endpoint_rawData_v3_thisEvent_date_of_insertion: "2022-11-19T16:15:20.906Z",
      points: {
        total_shots_home: 6,
        total_shots_away: 2,
        total_shots_home_ht: 0,
        total_shots_away_ht: 0,
        shots_off_in: "6-2 [3-2]",
        shots_off_in_ht: "0-0 [0-0]",
        totalPoints: "19.2",
        points_home: "12.3",
        points_away: "6.9",
        points_home_ht: "0.0",
        points_away_ht: "0.0",
        points_home_2t: "12.3",
        points_away_2t: "6.9",
        table_position_home: "",
        table_position_away: "",
        round: "37",
        league_name: "France Cup",
        league_cc: "fr",
        league_flag: "🇫🇷",
        placar_ft: "1-1",
        datt_home: 41,
        datt_away: 21,
        datt_per_minute: 1.1,
        att_home: 74,
        att_away: 56,
        on_target_home: 3,
        on_target_away: 2,
        off_target_home: 3,
        off_target_away: 0,
        datt_home_ht: 0,
        datt_away_ht: 0,
        att_home_ht: 0,
        att_away_ht: 0,
        corners_home: "3",
        corners_away: "1",
        possession_home: 0,
        possession_away: 0,
        yellowcards_home: "2",
        yellowcards_away: "3",
        redcards_home: "0",
        redcards_away: "0",
        on_target_home_ht: 0,
        on_target_away_ht: 0,
        off_target_home_ht: 0,
        off_target_away_ht: 0,
        power_index_ht: "H➡️NaN",
        power_index: "H➡️1.78",
        power_index_side: "H",
        power_index_factor: 1.7826086956521738,
        power_index_2t: "H➡️1.78",
        pointsIndex: "0.34",
        pointsIndexColoredSymbol: "🟡",
        pointsStringedWithBars: "||||||||||||-||||||",
        pointsStringedWithPeriod: "············x······",
        pointsHistory: {
          dattHist: [
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 1,
              h: 2,
              a: 0,
            },
            {
              m: 3,
              h: 2,
              a: 2,
            },
            {
              m: 4,
              h: 4,
              a: 2,
            },
            {
              m: 8,
              h: 4,
              a: 3,
            },
            {
              m: 11,
              h: 7,
              a: 4,
            },
            {
              m: 13,
              h: 9,
              a: 4,
            },
            {
              m: 14,
              h: 11,
              a: 4,
            },
            {
              m: 15,
              h: 11,
              a: 4,
            },
            {
              m: 16,
              h: 11,
              a: 4,
            },
            {
              m: 17,
              h: 11,
              a: 6,
            },
            {
              m: 19,
              h: 14,
              a: 7,
            },
            {
              m: 20,
              h: 14,
              a: 9,
            },
            {
              m: 21,
              h: 14,
              a: 9,
            },
            {
              m: 23,
              h: 16,
              a: 9,
            },
            {
              m: 25,
              h: 17,
              a: 12,
            },
            {
              m: 27,
              h: 17,
              a: 12,
            },
            {
              m: 29,
              h: 20,
              a: 12,
            },
            {
              m: 31,
              h: 22,
              a: 12,
            },
            {
              m: 33,
              h: 24,
              a: 12,
            },
            {
              m: 35,
              h: 25,
              a: 13,
            },
            {
              m: 37,
              h: 28,
              a: 13,
            },
            {
              m: 38,
              h: 28,
              a: 16,
            },
            {
              m: 41,
              h: 28,
              a: 19,
            },
            {
              m: 43,
              h: 29,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 19,
            },
            {
              m: 45,
              h: 33,
              a: 20,
            },
            {
              m: 47,
              h: 35,
              a: 20,
            },
            {
              m: 49,
              h: 37,
              a: 20,
            },
            {
              m: 55,
              h: 41,
              a: 21,
            },
          ],
          attHist: [
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 1,
              h: 3,
              a: 1,
            },
            {
              m: 3,
              h: 3,
              a: 4,
            },
            {
              m: 4,
              h: 7,
              a: 6,
            },
            {
              m: 8,
              h: 8,
              a: 12,
            },
            {
              m: 11,
              h: 9,
              a: 13,
            },
            {
              m: 13,
              h: 15,
              a: 14,
            },
            {
              m: 14,
              h: 18,
              a: 14,
            },
            {
              m: 15,
              h: 18,
              a: 17,
            },
            {
              m: 16,
              h: 18,
              a: 21,
            },
            {
              m: 17,
              h: 18,
              a: 23,
            },
            {
              m: 19,
              h: 22,
              a: 26,
            },
            {
              m: 20,
              h: 22,
              a: 27,
            },
            {
              m: 21,
              h: 24,
              a: 27,
            },
            {
              m: 23,
              h: 25,
              a: 28,
            },
            {
              m: 25,
              h: 26,
              a: 30,
            },
            {
              m: 27,
              h: 27,
              a: 31,
            },
            {
              m: 29,
              h: 32,
              a: 31,
            },
            {
              m: 31,
              h: 36,
              a: 33,
            },
            {
              m: 33,
              h: 40,
              a: 35,
            },
            {
              m: 35,
              h: 42,
              a: 35,
            },
            {
              m: 37,
              h: 45,
              a: 36,
            },
            {
              m: 38,
              h: 45,
              a: 37,
            },
            {
              m: 41,
              h: 47,
              a: 41,
            },
            {
              m: 43,
              h: 49,
              a: 42,
            },
            {
              m: 45,
              h: 54,
              a: 43,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 57,
              a: 46,
            },
            {
              m: 45,
              h: 58,
              a: 48,
            },
            {
              m: 47,
              h: 62,
              a: 50,
            },
            {
              m: 49,
              h: 64,
              a: 52,
            },
            {
              m: 55,
              h: 74,
              a: 56,
            },
          ],
        },
      },
      event_odds: {
        eventId_bsf: "5920589",
        isEndedEvent: 0,
        updated_at: "2022-11-19T16:09:27.497Z",
        source: "ZezinhoMicroserviceBSFbot",
        source_v: 21,
        odds_summary: {
          start: {
            home_odd: 2.25,
            draw_odd: 3,
            away_odd: 3,
            ss: null,
            t: null,
            add_time: "1668785645",
            home_prob: 44.4,
            draw_prob: 33.3,
            away_prob: 33.3,
            over_odd: 1.875,
            handicap: 2.25,
          },
          kickOff: {
            home_odd: 2.25,
            draw_odd: 3.1,
            away_odd: 3.1,
            ss: "0-0",
            t: "1",
            add_time: "1668870226",
            home_prob: 44.4,
            draw_prob: 32.3,
            away_prob: 32.3,
            over_odd: 1.9,
            handicap: 2.25,
          },
          end: {
            home_odd: 2.875,
            draw_odd: 2.2,
            away_odd: 3.75,
            ss: "1-1",
            t: "48",
            add_time: "1668874083",
            home_prob: 34.8,
            draw_prob: 45.5,
            away_prob: 26.7,
            over_odd: 2.1,
            handicap: 3.25,
          },
        },
        odds: {
          moneyLine_1_1: {
            last: {
              home_odd: "2.875",
              draw_odd: "2.200",
              away_odd: "3.750",
              ss: "1-1",
              time_str: "48",
              add_time: "1668874083",
            },
          },
          moneyLineHT_1_8: {
            last: {
              home_odd: "12.000",
              draw_odd: "1.083",
              away_odd: "15.000",
              ss: "1-1",
              time_str: "41",
              add_time: "1668872594",
            },
          },
          goal_line_1_3: {
            last: {
              over_odd: "1.750",
              handicap: "3",
              under_odd: "2.125",
              ss: "1-1",
              time_str: "49",
              add_time: "1668874150",
            },
          },
          ht_goal_line_1_6: {
            last: {
              over_odd: "6.600",
              handicap: "2.5",
              under_odd: "1.110",
              ss: "1-1",
              time_str: "40",
              add_time: "1668872561",
            },
          },
        },
        favorite_H_A: "H",
        favorite_odd: 2.25,
        favorite_category: 0,
        favorite_symbol: "",
        overNextGolHT: 6.6,
        overNextGol: 1.425,
      },
      eventsToShow: [
        {
          id: "118490234",
          text: "21' - 1st Goal -   (ASM Belfort) -",
          symbolToShow: "⚽️",
          minuteToShow: "21'",
          minuteSequential: 12000,
          brClock: "1T 21:00",
          homeOrAway: "A",
        },
        {
          id: "118491915",
          text: "30' - 2nd Goal -   (Haguenau) -",
          symbolToShow: "⚽️",
          minuteToShow: "30'",
          minuteSequential: 12900,
          brClock: "1T 30:00",
          homeOrAway: "H",
        },
        {
          id: "118495521",
          text: "Score After First Half - 1-1",
          symbolToShow: " 1-1",
          minuteToShow: "HT",
          homeOrAway: "-",
        },
      ],
      eventsToShow_onlyGoals: [
        {
          id: "118490234",
          text: "21' - 1st Goal -   (ASM Belfort) -",
          symbolToShow: "⚽️",
          minuteToShow: "21'",
          minuteSequential: 12000,
          brClock: "1T 21:00",
          homeOrAway: "A",
        },
        {
          id: "118491915",
          text: "30' - 2nd Goal -   (Haguenau) -",
          symbolToShow: "⚽️",
          minuteToShow: "30'",
          minuteSequential: 12900,
          brClock: "1T 30:00",
          homeOrAway: "H",
        },
      ],
      eventsToShow_onlyRedCards: [],
      pointsSlices: {
        minutes_array: ["05'", "10'", "15'", "20'", "25'", "30'", "35'", "40'", "45'", "50'", "55'", "60'"],
        minutesToShow_array: ["🟢", "🔴", "🟢", "🟡", "🟢", "🟢", "🔴", "🔴", "🔴", "🟡", "🟡", "🔴"],
        minutesToShow_array2: ["+", "-", "+", "~", "+", "+", "-", "-", "-", "~", "~", "-"],
        minutesToShow_stringed: "🟢🔴🟢🟡🟢🟢🔴🔴🔴|🟡🟡🔴",
        minutesToShow_stringed2: "+ - + ~ + + - - - |~ ~ - ",
        minutesOfGoalsToShow_array: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        minutesOfHomeGoalsToShow_array: ["", "", "", "", "", "", "⚽️", "", "", "", "", ""],
        minutesOfAwayGoalsToShow_array: ["", "", "", "", "⚽️", "", "", "", "", "", "", ""],
        minutesOfHomeGoalsToShow_array_stringed: "▫️▫️▫️▫️▫️▫️⚽️▫️▫️󠀠󠀠󠀠󠀠|▫️▫️▫️",
        minutesOfAwayGoalsToShow_array_stringed: "▫️▫️▫️▫️⚽️▫️▫️▫️▫️󠀠󠀠󠀠󠀠|▫️▫️▫️",
        homeGoalsSlices: [],
        awayGoalsSlices: [],
        minutesOfRedCardsToShow_array: [],
        minutesOfHomeRedCardsToShow_array: ["", "", "", "", "", "", "", "", "", "", "", ""],
        minutesOfAwayRedCardsToShow_array: ["", "", "", "", "", "", "", "", "", "", "", ""],
        minutesOfHomeRedCardsAndGoalsToShow_array: ["", "", "", "", "", "", "⚽️", "", "", "", "", ""],
        minutesOfAwayRedCardsAndGoalsToShow_array: ["", "", "", "", "⚽️", "", "", "", "", "", "", ""],
        pointsSlices: [
          {
            slice_minute: 5,
            home_points: 1.25,
            away_points: 1.5,
            total_points: 2.75,
          },
          {
            slice_minute: 10,
            home_points: 0.3,
            away_points: 0.4,
            total_points: 0.7,
          },
          {
            slice_minute: 15,
            home_points: 1.95,
            away_points: 0.25,
            total_points: 2.2,
          },
          {
            slice_minute: 20,
            home_points: 0.5,
            away_points: 1.1,
            total_points: 1.6,
          },
          {
            slice_minute: 25,
            home_points: 1,
            away_points: 1.45,
            total_points: 2.45,
          },
          {
            slice_minute: 30,
            home_points: 2.6,
            away_points: 0.05,
            total_points: 2.65,
          },
          {
            slice_minute: 35,
            home_points: 0.85,
            away_points: 0.3,
            total_points: 1.15,
          },
          {
            slice_minute: 40,
            home_points: 0.7,
            away_points: 0.55,
            total_points: 1.25,
          },
          {
            slice_minute: 45,
            home_points: 0.8,
            away_points: 0.45,
            total_points: 1.25,
          },
          {
            slice_minute: 50,
            home_points: 0.95,
            away_points: 0.55,
            total_points: 1.5,
          },
          {
            slice_minute: 55,
            home_points: 1.35,
            away_points: 0.3,
            total_points: 1.65,
          },
          {
            slice_minute: 60,
            home_points: 0.05,
            away_points: 0,
            total_points: 0.05,
          },
        ],
        points_per_Minutes_Slices: ["0.55", "0.14", "0.44", "0.32", "0.49", "0.53", "0.23", "0.25", "0.25", "0.30", "0.33", "0.01"],
        home_slice_points_array: [1.25, 0.3, 1.95, 0.5, 1, 2.6, 0.85, 0.7, 0.8, 0.95, 1.35, 0.05],
        home_slice_points_array_zeroFilled: [1.25, 0.3, 1.95, 0.5, 1, 2.6, 0.85, 0.7, 0.8, 0.95, 1.35, 0.05, 0, 0, 0, 0, 0, 0],
        home_slice_only_datt_points_array_zeroFilled: [4, 2, 5, 3, 3, 3, 4, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0],
        away_slice_points_array: [1.5, 0.4, 0.25, 1.1, 1.45, 0.05, 0.3, 0.55, 0.45, 0.55, 0.3, 0],
        away_slice_points_array_reverse: [-1.5, -0.4, -0.25, -1.1, -1.45, -0.05, -0.3, -0.55, -0.45, -0.55, -0.3, 0],
        away_slice_points_array_reverse_zeroFilled: [-1.5, -0.4, -0.25, -1.1, -1.45, -0.05, -0.3, -0.55, -0.45, -0.55, -0.3, 0, 0, 0, 0, 0, 0, 0],
        away_slice_only_datt_points_array_reverse_zeroFilled: [-2, -1, -1, -5, -3, 0, -1, -3, -3, -1, -1, 0, 0, 0, 0, 0, 0, 0],
        home_slice_points_array_stringed: "◾️▫️◾️▪️◾️⬛️▪️▪️▪️󠀠󠀠󠀠󠀠|▪️◾️▫️",
        away_slice_points_array_stringed: "◾️▫️▫️◾️◾️▫️▫️▪️▫️󠀠󠀠󠀠󠀠|▪️▫️▫️",
        total_points_array: [2.75, 0.7, 2.2, 1.6, 2.45, 2.65, 1.15, 1.25, 1.25, 1.5, 1.65, 0.05],
        total_points_array_stringed: "2.8 0.7 2.2 1.6 2.5 2.6 1.1 1.3 1.3 |1.5 1.6 0.1 ",
        goals_slices_array: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        powerIndex_array: [-1.2, -1.33, 7.8, -2.2, -1.45, 52, 2.83, 1.27, 1.78, 1.73, 4.5, 0],
        powerIndexToShow_stringed: "⏸◀️️️⏩️◀️️️◀️️️⏩️⏩️⏸▶️|▶️⏩️▫️",
        powerIndexToShow_stringed2: "⏸◀️️️➡◀️️️◀️️️➡➡⏸▶️|▶️➡▫️",
        powerIndexToShow_stringed_home: "⏸▫️➡▫️▫️➡➡⏸▶️|▶️➡▫️",
        powerIndexToShow_stringed_away: "⏸◀️️️▫️◀️️️◀️️️▫️▫️⏸▫️|▫️▫️▫️",
        powerIndexToShow_stringed_HhAa: "= a H a a H H = h |h H ▫️ ",
        powerIndexToShow_stringed_HhAa_merged: "=+ a- H+ a~ a+ H+ H- =- h- |h~ H~ ▫️- ",
        maxMinuteWithData: 55,
        points_per_min_color_symbols: "🟡 🟡 🟡 🟡 🟡",
        points_per_min_color_symbol: "🟡",
        total_points: 19.2,
        points_per_min: "0.35",
        points_per_min_color: "#daa520",
      },
      timeStamps: {
        time_stringed_ISO_8601: "2022-11-19T15:00:00.000Z",
        time_stringed_withZoneBR: "19/Nov 12:00 GMT-0300",
        timeUntilKickOff_stringed: "-1h15m",
      },
      bf_mostSimilarComparison: {
        eventMostSimilar: {
          id: "31917215",
          name: "Albania v Armenia",
          marketCount: "",
        },
        greaterSimilarityValue: 0.36,
        greaterSimilarityTop5Rank: [
          {
            eventName: "Albania v Armenia",
            eventId: "31917215",
            eventSimilarityValue: 0.36,
          },
          {
            eventName: "Latvia v Iceland",
            eventId: "31917346",
            eventSimilarityValue: 0.32,
          },
          {
            eventName: "Slovenia v Montenegro",
            eventId: "31916381",
            eventSimilarityValue: 0.32,
          },
          {
            eventName: "Sweden v Algeria",
            eventId: "31916380",
            eventSimilarityValue: 0.32,
          },
          {
            eventName: "Peru v Bolivia",
            eventId: "31915674",
            eventSimilarityValue: 0.32,
          },
        ],
        bf_odds: {
          match_odds: {
            marketId: "1.206606146",
            marketName: "Match Odds",
            totalMatched: 12865.54,
            home_odd: 1.62,
            draw_odd: 3.85,
            away_odd: 7,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-19T09:22:43.734Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_2_5: {
            marketId: "1.206606191",
            marketName: "Over/Under 2.5 Goals",
            totalMatched: 109.71,
            under_odd: 1.68,
            under_odd_lastPriceTraded: 1.68,
            over_odd: 2.28,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-19T08:43:32.637Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_1_5: {
            marketId: "1.206606194",
            marketName: "Over/Under 1.5 Goals",
            totalMatched: 37.05,
            under_odd: 3,
            under_odd_lastPriceTraded: 2.94,
            over_odd: 1.41,
            over_odd_lastPriceTraded: 1.42,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-19T02:49:51.419Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_HT_0_5: {
            marketId: "1.206606149",
            marketName: "First Half Goals 0.5",
            totalMatched: 0,
            under_odd: 2.64,
            over_odd: 1.47,
            isMarketDataDelayed: true,
            betDelay: 0,
            status: "OPEN",
            runners_status: "ACTIVE",
          },
        },
      },
      bf_mostSimilarComparison_Live: {
        eventMostSimilar: {
          id: "31918429",
          name: "Barcelona B v Athletic Bilbao B",
          countryCode: "ES",
          marketCount: 24,
        },
        totalInPlayEvents: 192,
        mostSimilarRankMaxLength: 5,
        greaterSimilarityValue: 0.4,
        greaterSimilarityRank: [
          {
            id: "31918429",
            name: "Barcelona B v Athletic Bilbao B",
            cc: "ES",
            sim_value: 0.4,
          },
          {
            id: "31917050",
            name: "Kongsvinger v Sandefjord",
            cc: "NO",
            sim_value: 0.35,
          },
          {
            id: "31918840",
            name: "CD Basconia v Pasaia Kirol Elkartea",
            cc: "ES",
            sim_value: 0.35,
          },
          {
            id: "31920018",
            name: "Amiens v Aiglon Le Lamentin",
            cc: "FR",
            sim_value: 0.35,
          },
          {
            id: "31920241",
            name: "Spain U19 v Japan U19",
            sim_value: 0.15,
          },
        ],
      },
      bfOdds_fromPropertieCache: {
        bsf_id: "5920589",
        bsf_fullName: "Haguenau v ASM Belfort",
        bsf_time: "1668870000",
        bfEventId: "31917215",
        bf_eventName: "Albania v Armenia",
        bf_homeOdd_pregame: 1.62,
        bf_drawOdd_pregame: 3.85,
        bf_awayOdd_pregame: 7,
        bf_overOdd2_5_pregame: 2.28,
        bf_overOdd0_5HT_pregame: 1.47,
      },
      textsToShow: {
        overOdds: {
          eventOddsSummaryTextMsgParsedToSend_ML: "2.25|3|3.1",
          eventOddsSummaryTextMsgParsedToSend_GoalLine: " 2.25@1.9",
          eventOddsTextMsgParsedToSend_GoalLine: " 3@1.8 (1.43)",
          eventOddsTextMsgParsedToSend_GoalLineHT: "2.5ht@6.6 (6.60)",
        },
        bfUpcomingEventOdds: "2.5@2.28 0.5ht@1.47",
        pointsStringedWithFavoriteSymbol: "  ············x······",
      },
      eventTextMsgParsedToSendWithTeamOdds:
        "\n(2T 10:18)  <code>2.875</code> Haguenau <b>1-1 (1-1)</b> ASM Belfort <code>3.75</code>  [5920589] \n19.2 [12 v 7]  6🥅2  3🎯2   41💥21 (1.1)   0%0  0.34🟡  H➡️1.78\n2.25|3|3.1  2.25@1.9  ⚽ 3@1.8 (1.43)  bf{2.5@2.28 0.5ht@1.47}  ············x······\n🟢🔴🟢🟡🟢🟢🔴🔴🔴|🟡🟡🔴\n▫️▫️▫️▫️▫️▫️⚽️▫️▫️󠀠󠀠󠀠󠀠|▫️▫️▫️\n◾️▫️◾️▪️◾️⬛️▪️▪️▪️󠀠󠀠󠀠󠀠|▪️◾️▫️\n◾️▫️▫️◾️◾️▫️▫️▪️▫️󠀠󠀠󠀠󠀠|▪️▫️▫️\n▫️▫️▫️▫️⚽️▫️▫️▫️▫️󠀠󠀠󠀠󠀠|▫️▫️▫️\n",
      has_selected_team: false,
      selectedTeam: {
        has_selected_team: false,
        selected_team_homeOrAway: "",
        team: {},
        odd: 0,
      },
      selectedTeamMaxOdd: {
        has_selected_team: false,
        selected_team_homeOrAway: "",
        team: {},
        odd: 0,
      },
      bsfEventsHistory: {
        h2h: [
          {
            id: "5694981",
            time: "1664640000",
            ss: "1-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-1 (0-1) ASM Belfort",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "ASM Belfort",
            fullScore: "1-1 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {},
          },
        ],
        home: [
          {
            id: "5888080",
            time: "1668263400",
            ss: "1-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-0 (1-0) Furiani Agliani",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Furiani Agliani",
            fullScore: "1-0 (1-0)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
            result: "W",
          },
          {
            id: "5786315",
            time: "1666454400",
            ss: "1-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-1 (0-0) US Lusitanos Saint-Maur",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "US Lusitanos Saint-Maur",
            fullScore: "1-1 (0-0)",
            totalGoals: 2,
            totalGoalsHT: 0,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5694981",
            time: "1664640000",
            ss: "1-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-1 (0-1) ASM Belfort",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "ASM Belfort",
            fullScore: "1-1 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5598980",
            time: "1662825600",
            ss: "3-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 3-0 (0-0) Reims II",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Reims II",
            fullScore: "3-0 (0-0)",
            totalGoals: 3,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {},
            result: "W",
          },
          {
            id: "5565091",
            time: "1662220800",
            ss: "1-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-1 (1-0) FC Fleury 91",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "FC Fleury 91",
            fullScore: "1-1 (1-0)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5529319",
            time: "1661616000",
            ss: "0-0",
            time_status: "3",
            stringedGameWithRedcards: "Boulogne 0-0 (0-0) Haguenau",
            league_name: "France National 2",
            home_name: "Boulogne",
            away_name: "Haguenau",
            fullScore: "0-0 (0-0)",
            totalGoals: 0,
            totalGoalsHT: 0,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5491277",
            time: "1661011200",
            ss: "1-2",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-2 (0-2) Creteil",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Creteil",
            fullScore: "1-2 (0-2)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "A",
            tm_stats: {},
            result: "L",
          },
          {
            id: "5079843",
            time: "1653753600",
            ss: "3-1",
            time_status: "3",
            stringedGameWithRedcards: "Entente SSG 3-1 (2-1) Haguenau",
            league_name: "France National 2",
            home_name: "Entente SSG",
            away_name: "Haguenau",
            fullScore: "3-1 (2-1)",
            totalGoals: 4,
            totalGoalsHT: 3,
            resultCol: "H",
            tm_stats: {},
            result: "L",
          },
          {
            id: "5051400",
            time: "1653148800",
            ss: "4-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 4-1 (1-0) Schiltigheim",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Schiltigheim",
            fullScore: "4-1 (1-0)",
            totalGoals: 5,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
            result: "W",
          },
          {
            id: "4965663",
            time: "1651334400",
            ss: "0-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 0-0 (0-0) US Lusitanos Saint-Maur",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "US Lusitanos Saint-Maur",
            fullScore: "0-0 (0-0)",
            totalGoals: 0,
            totalGoalsHT: 0,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "4939030",
            time: "1650729600",
            ss: "2-0",
            time_status: "3",
            stringedGameWithRedcards: "FC Fleury 91 2-0 (1-0) Haguenau",
            league_name: "France National 2",
            home_name: "FC Fleury 91",
            away_name: "Haguenau",
            fullScore: "2-0 (1-0)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "4911647",
            time: "1650121200",
            ss: "0-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "🟥 Haguenau 0-1 (0-0) Lens II",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Lens II",
            fullScore: "0-1 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "4755857",
            time: "1646492400",
            ss: "2-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 2-1 (1-0) Auxerre II",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Auxerre II",
            fullScore: "2-1 (1-0)",
            totalGoals: 3,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "4701680",
            time: "1645290000",
            ss: "3-3",
            time_status: "3",
            stringedGameWithRedcards: "Reims II 3-3 (3-1) Haguenau 🟥",
            league_name: "France National 2",
            home_name: "Reims II",
            away_name: "Haguenau",
            fullScore: "3-3 (3-1)",
            totalGoals: 6,
            totalGoalsHT: 4,
            resultCol: "D",
            tm_stats: {},
          },
          {
            id: "4676415",
            time: "1644681600",
            ss: "1-4",
            time_status: "3",
            stringedGameWithRedcards: "Haguenau 1-4 (0-1) Sainte Genevieve Sports",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Sainte Genevieve Sports",
            fullScore: "1-4 (0-1)",
            totalGoals: 5,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "4582187",
            time: "1642863600",
            ss: "3-2",
            time_status: "3",
            stringedGameWithRedcards: "Haguenau 3-2 (2-2) Epinal 🟥",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Epinal",
            fullScore: "3-2 (2-2)",
            totalGoals: 5,
            totalGoalsHT: 4,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "4528320",
            time: "1641661200",
            ss: "2-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 2-1 (1-0) Metz II",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Metz II",
            fullScore: "2-1 (1-0)",
            totalGoals: 3,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "4403229",
            time: "1638637200",
            ss: "3-0",
            time_status: "3",
            stringedGameWithRedcards: "US Lusitanos Saint-Maur 3-0 (0-0) Haguenau 🟥",
            league_name: "France National 2",
            home_name: "US Lusitanos Saint-Maur",
            away_name: "Haguenau",
            fullScore: "3-0 (0-0)",
            totalGoals: 3,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "4110981",
            time: "1632582000",
            ss: "2-2",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 2-2 (1-2) Paris 13 Atletico",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Paris 13 Atletico",
            fullScore: "2-2 (1-2)",
            totalGoals: 4,
            totalGoalsHT: 3,
            resultCol: "D",
            tm_stats: {},
          },
          {
            id: "4073226",
            time: "1631980800",
            ss: "0-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "🟥 Haguenau 0-1 (0-0) Beauvais",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "Beauvais",
            fullScore: "0-1 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {},
          },
        ],
        away: [
          {
            id: "5832539",
            time: "1667106000",
            ss: "0-3",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "AS Venus 0-3 (0-0) ASM Belfort",
            league_name: "France Cup",
            home_name: "AS Venus",
            away_name: "ASM Belfort",
            fullScore: "0-3 (0-0)",
            totalGoals: 3,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {},
            result: "W",
          },
          {
            id: "5788095",
            time: "1666454400",
            ss: "2-2",
            time_status: "3",
            stringedGameWithRedcards: "Metz II 2-2 (1-1) ASM Belfort",
            league_name: "France National 2",
            home_name: "Metz II",
            away_name: "ASM Belfort",
            fullScore: "2-2 (1-1)",
            totalGoals: 4,
            totalGoalsHT: 2,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5694981",
            time: "1664640000",
            ss: "1-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Haguenau 1-1 (0-1) ASM Belfort",
            league_name: "France National 2",
            home_name: "Haguenau",
            away_name: "ASM Belfort",
            fullScore: "1-1 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5598975",
            time: "1662825600",
            ss: "1-2",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Creteil 1-2 (1-0) ASM Belfort",
            league_name: "France National 2",
            home_name: "Creteil",
            away_name: "ASM Belfort",
            fullScore: "1-2 (1-0)",
            totalGoals: 3,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {},
            result: "W",
          },
          {
            id: "5565093",
            time: "1662220800",
            ss: "2-1",
            time_status: "3",
            stringedGameWithRedcards: "ASM Belfort 2-1 (2-1) Racing Besancon",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Racing Besancon",
            fullScore: "2-1 (2-1)",
            totalGoals: 3,
            totalGoalsHT: 3,
            resultCol: "H",
            tm_stats: {},
            result: "W",
          },
          {
            id: "5491274",
            time: "1661011200",
            ss: "0-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "ASM Belfort 0-0 (0-0) Wasquehal 🟥",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Wasquehal",
            fullScore: "0-0 (0-0)",
            totalGoals: 0,
            totalGoalsHT: 0,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "5331939",
            time: "1658253600",
            ss: "1-2",
            time_status: "3",
            stringedGameWithRedcards: "ASM Belfort 1-2 (1-1) Sochaux",
            league_name: "Europe Friendlies",
            home_name: "ASM Belfort",
            away_name: "Sochaux",
            fullScore: "1-2 (1-1)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "A",
            tm_stats: {},
            result: "L",
          },
          {
            id: "5079621",
            time: "1653753600",
            ss: "4-2",
            time_status: "3",
            stringedGameWithRedcards: "ASM Belfort 4-2 (1-1) Reims II",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Reims II",
            fullScore: "4-2 (1-1)",
            totalGoals: 6,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {},
            result: "W",
          },
          {
            id: "4993007",
            time: "1651939200",
            ss: "0-1",
            time_status: "3",
            stringedGameWithRedcards: "ASM Belfort 0-1 (0-1) Beauvais 🟥",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Beauvais",
            fullScore: "0-1 (0-1)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {},
            result: "L",
          },
          {
            id: "4961584",
            time: "1651255200",
            ss: "1-1",
            time_status: "3",
            stringedGameWithRedcards: "ASM Belfort 1-1 (1-1) Epinal",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Epinal",
            fullScore: "1-1 (1-1)",
            totalGoals: 2,
            totalGoalsHT: 2,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "4881553",
            time: "1649520000",
            ss: "0-1",
            time_status: "3",
            stringedGameWithRedcards: "🟥 Metz II 0-1 (0-1) ASM Belfort",
            league_name: "France National 2",
            home_name: "Metz II",
            away_name: "ASM Belfort",
            fullScore: "0-1 (0-1)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "4731117",
            time: "1645894800",
            ss: "0-1",
            time_status: "3",
            stringedGameWithRedcards: "🟥 ASM Belfort 0-1 (0-1) Sainte Genevieve Sports",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Sainte Genevieve Sports",
            fullScore: "0-1 (0-1)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "4582189",
            time: "1642867200",
            ss: "1-2",
            time_status: "3",
            stringedGameWithRedcards: "Auxerre II 1-2 (0-1) ASM Belfort 🟥",
            league_name: "France National 2",
            home_name: "Auxerre II",
            away_name: "ASM Belfort",
            fullScore: "1-2 (0-1)",
            totalGoals: 3,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "4429306",
            time: "1639242000",
            ss: "0-1",
            time_status: "3",
            stringedGameWithRedcards: "Beauvais 0-1 (0-0) ASM Belfort",
            league_name: "France National 2",
            home_name: "Beauvais",
            away_name: "ASM Belfort",
            fullScore: "0-1 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "4168007",
            time: "1633795200",
            ss: "1-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "US Lusitanos Saint-Maur 1-0 (0-0) ASM Belfort",
            league_name: "France National 2",
            home_name: "US Lusitanos Saint-Maur",
            away_name: "ASM Belfort",
            fullScore: "1-0 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "3906982",
            time: "1628956800",
            ss: "2-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "ASM Belfort 2-1 (2-0) Auxerre II",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "Auxerre II",
            fullScore: "2-1 (2-0)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "3879245",
            time: "1628348400",
            ss: "3-0",
            time_status: "3",
            stringedGameWithRedcards: "Reims II 3-0 (1-0) ASM Belfort",
            league_name: "France National 2",
            home_name: "Reims II",
            away_name: "ASM Belfort",
            fullScore: "3-0 (1-0)",
            totalGoals: 3,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "3917652",
            time: "1612702800",
            ss: "1-3",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "ASM Belfort 1-3 (0-2) Louhans-Cuiseaux",
            league_name: "France Cup",
            home_name: "ASM Belfort",
            away_name: "Louhans-Cuiseaux",
            fullScore: "1-3 (0-2)",
            totalGoals: 4,
            totalGoalsHT: 2,
            resultCol: "A",
            tm_stats: {},
          },
          {
            id: "2782728",
            time: "1601136000",
            ss: "1-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "AC Bobigny 1-0 (0-0) ASM Belfort 🟥",
            league_name: "France National 2",
            home_name: "AC Bobigny",
            away_name: "ASM Belfort",
            fullScore: "1-0 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "2753950",
            time: "1600522200",
            ss: "2-0",
            time_status: "3",
            stringedGameWithRedcards: "ASM Belfort 2-0 (1-0) US Lusitanos Saint-Maur",
            league_name: "France National 2",
            home_name: "ASM Belfort",
            away_name: "US Lusitanos Saint-Maur",
            fullScore: "2-0 (1-0)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {},
          },
        ],
        last10stats: {
          h2h: {
            total: 1,
            totalGoals: 2,
            o0_5: 1,
            o1_5: 1,
            o2_5: 0,
            o3_5: 0,
            o0_5ht: 1,
            o1_5ht: 0,
            o2_5ht: 0,
            o0_52t: 1,
            o1_52t: 0,
            o2_52t: 0,
            gols1t: 1,
            gols2t: 1,
            gols1t_pct: 0.5,
            gols2t_pct: 0.5,
          },
          home: {
            total: 10,
            totalGoals: 22,
            o0_5: 8,
            o1_5: 7,
            o2_5: 4,
            o3_5: 2,
            o0_5ht: 6,
            o1_5ht: 2,
            o2_5ht: 1,
            o0_52t: 7,
            o1_52t: 3,
            o2_52t: 2,
            gols1t: 9,
            gols2t: 13,
            gols1t_pct: 0.41,
            gols2t_pct: 0.59,
            scored: 8,
            cleanSheet: 4,
          },
          away: {
            total: 10,
            totalGoals: 27,
            o0_5: 9,
            o1_5: 8,
            o2_5: 6,
            o3_5: 2,
            o0_5ht: 8,
            o1_5ht: 5,
            o2_5ht: 1,
            o0_52t: 6,
            o1_52t: 4,
            o2_52t: 2,
            gols1t: 14,
            gols2t: 13,
            gols1t_pct: 0.52,
            gols2t_pct: 0.48,
            scored: 8,
            cleanSheet: 2,
          },
        },
      },
      bf_odds_live: {
        match_odds: {
          marketId: "1.206606146",
          marketName: "Match Odds",
          totalMatched: 122003.75,
          home_odd: 1.65,
          draw_odd: 3.9,
          away_odd: 7,
          isMarketDataDelayed: true,
          betDelay: 0,
          lastMatchTime: "2022-11-19T16:11:01.904Z",
          status: "OPEN",
          runners_status: "ACTIVE",
        },
        over_under_2_5: {
          marketId: "1.206606191",
          marketName: "Over/Under 2.5 Goals",
          totalMatched: 14592.79,
          under_odd: 1.74,
          under_odd_lastPriceTraded: 1.77,
          over_odd: 2.3,
          isMarketDataDelayed: true,
          betDelay: 0,
          lastMatchTime: "2022-11-19T16:05:02.500Z",
          status: "OPEN",
          runners_status: "ACTIVE",
          over_odd_lastPriceTraded: 2.3,
        },
        over_under_0_5_HT: {
          marketId: "1.206606149",
          marketName: "First Half Goals 0.5",
          totalMatched: 3008.67,
          under_odd: 2.86,
          over_odd: 1.51,
          isMarketDataDelayed: true,
          betDelay: 0,
          status: "OPEN",
          runners_status: "ACTIVE",
          under_odd_lastPriceTraded: 2.96,
          lastMatchTime: "2022-11-19T16:00:10.083Z",
          over_odd_lastPriceTraded: 1.51,
        },
      },
      bf_odds_live_history: {
        match_odds: {
          marketId: "1.206606146",
          history: [
            {
              m: 0,
              h: 1.62,
              d: 3.85,
              a: 7,
            },
            {
              m: 0,
              h: 1.59,
              d: 4,
              a: 7.2,
            },
            {
              m: 0,
              h: 1.59,
              d: 4.1,
              a: 7.4,
            },
            {
              m: 0,
              h: 1.59,
              d: 4.1,
              a: 7.4,
            },
            {
              m: 0,
              h: 1.59,
              d: 4.1,
              a: 7.4,
            },
            {
              m: 2,
              h: 1.6,
              d: 4.1,
              a: 7.4,
            },
            {
              m: 4,
              h: 1.6,
              d: 4.1,
              a: 7.4,
            },
            {
              m: 5,
              h: 1.6,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 9,
              h: 1.6,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 12,
              h: 1.6,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 14,
              h: 1.59,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 15,
              h: 1.59,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 16,
              h: 1.59,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 17,
              h: 1.59,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 18,
              h: 1.59,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 20,
              h: 1.6,
              d: 4.1,
              a: 7.2,
            },
            {
              m: 21,
              h: 1.6,
              d: 4.1,
              a: 7,
            },
            {
              m: 22,
              h: 1.6,
              d: 4.1,
              a: 7,
            },
            {
              m: 24,
              h: 1.61,
              d: 4.1,
              a: 6.8,
            },
            {
              m: 26,
              h: 1.61,
              d: 4,
              a: 7,
            },
            {
              m: 28,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 30,
              h: 1.64,
              d: 3.95,
              a: 7,
            },
            {
              m: 32,
              h: 1.64,
              d: 3.95,
              a: 7,
            },
            {
              m: 34,
              h: 1.64,
              d: 4,
              a: 7,
            },
            {
              m: 36,
              h: 1.64,
              d: 4,
              a: 7,
            },
            {
              m: 38,
              h: 1.64,
              d: 4,
              a: 7,
            },
            {
              m: 39,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 42,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 44,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7.2,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7.2,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.62,
              d: 4,
              a: 7.2,
            },
            {
              m: 46,
              h: 1.63,
              d: 4,
              a: 7,
            },
            {
              m: 46,
              h: 1.65,
              d: 3.9,
              a: 6.8,
            },
            {
              m: 48,
              h: 1.69,
              d: 3.85,
              a: 6.6,
            },
            {
              m: 50,
              h: 1.68,
              d: 3.9,
              a: 6.2,
            },
            {
              m: 56,
              h: 1.65,
              d: 3.9,
              a: 7,
            },
          ],
        },
        over_under_2_5: {
          marketId: "1.206606191",
          history: [
            {
              m: 0,
              o: 2.28,
              u: 1.68,
            },
            {
              m: 0,
              o: 2.32,
              u: 1.71,
            },
            {
              m: 0,
              o: 2.32,
              u: 1.71,
            },
            {
              m: 0,
              o: 2.32,
              u: 1.71,
            },
            {
              m: 0,
              o: 2.32,
              u: 1.71,
            },
            {
              m: 2,
              o: 2.34,
              u: 1.72,
            },
            {
              m: 4,
              o: 2.34,
              u: 1.72,
            },
            {
              m: 5,
              o: 2.34,
              u: 1.73,
            },
            {
              m: 9,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 12,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 14,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 15,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 16,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 17,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 18,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 20,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 21,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 22,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 24,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 26,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 28,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 30,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 32,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 34,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 36,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 38,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 39,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 42,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 44,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 46,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 48,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 50,
              o: 2.3,
              u: 1.74,
            },
            {
              m: 56,
              o: 2.3,
              u: 1.74,
            },
          ],
        },
        over_under_0_5_HT: {
          marketId: "1.206606149",
          history: [
            {
              m: 0,
              o: 1.47,
              u: 2.64,
            },
            {
              m: 0,
              o: 1.52,
              u: 2.82,
            },
            {
              m: 0,
              o: 1.52,
              u: 2.82,
            },
            {
              m: 0,
              o: 1.52,
              u: 2.82,
            },
            {
              m: 0,
              o: 1.52,
              u: 2.82,
            },
            {
              m: 2,
              o: 1.52,
              u: 2.82,
            },
            {
              m: 4,
              o: 1.52,
              u: 2.82,
            },
            {
              m: 5,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 9,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 12,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 14,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 15,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 16,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 17,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 18,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 20,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 21,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 22,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 24,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 26,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 28,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 30,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 32,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 34,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 36,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 38,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 39,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 42,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 44,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.84,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.86,
            },
            {
              m: 46,
              o: 1.51,
              u: 2.86,
            },
            {
              m: 48,
              o: 1.51,
              u: 2.86,
            },
            {
              m: 50,
              o: 1.51,
              u: 2.86,
            },
            {
              m: 56,
              o: 1.51,
              u: 2.86,
            },
          ],
        },
      },
      bsf_odds_live_history: {
        match_odds: {
          history: [
            {
              m: 0,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 0,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 0,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 0,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 0,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 2,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 4,
              h: "2.200",
              d: "3.100",
              a: "3.100",
              ss: null,
            },
            {
              m: 5,
              h: "2.250",
              d: "3.200",
              a: "3.200",
              ss: "0-0",
            },
            {
              m: 9,
              h: "2.300",
              d: "3.100",
              a: "3.200",
              ss: "0-0",
            },
            {
              m: 12,
              h: "2.300",
              d: "3.100",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 14,
              h: "2.300",
              d: "3.000",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 15,
              h: "2.300",
              d: "3.000",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 16,
              h: "2.300",
              d: "3.000",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 17,
              h: "2.375",
              d: "3.000",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 18,
              h: "2.375",
              d: "3.000",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 20,
              h: "2.375",
              d: "2.875",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 21,
              h: "2.375",
              d: "2.875",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 22,
              h: "2.375",
              d: "2.875",
              a: "3.250",
              ss: "0-0",
            },
            {
              m: 24,
              h: "5.000",
              d: "3.250",
              a: "1.727",
              ss: "0-1",
            },
            {
              m: 26,
              h: "5.000",
              d: "3.250",
              a: "1.727",
              ss: "0-1",
            },
            {
              m: 28,
              h: "5.500",
              d: "3.250",
              a: "1.727",
              ss: "0-1",
            },
            {
              m: 30,
              h: "5.500",
              d: "3.250",
              a: "1.727",
              ss: "0-1",
            },
            {
              m: 32,
              h: "2.500",
              d: "2.750",
              a: "3.400",
              ss: "1-1",
            },
            {
              m: 34,
              h: "2.500",
              d: "2.625",
              a: "3.400",
              ss: "1-1",
            },
            {
              m: 36,
              h: "2.500",
              d: "2.600",
              a: "3.400",
              ss: "1-1",
            },
            {
              m: 38,
              h: "2.600",
              d: "2.600",
              a: "3.500",
              ss: "1-1",
            },
            {
              m: 39,
              h: "2.600",
              d: "2.500",
              a: "3.500",
              ss: "1-1",
            },
            {
              m: 42,
              h: "2.625",
              d: "2.500",
              a: "3.500",
              ss: "1-1",
            },
            {
              m: 44,
              h: "2.625",
              d: "2.400",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.375",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 46,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 48,
              h: "2.750",
              d: "2.300",
              a: "3.600",
              ss: "1-1",
            },
            {
              m: 50,
              h: "2.750",
              d: "2.250",
              a: "3.750",
              ss: "1-1",
            },
            {
              m: 56,
              h: "2.875",
              d: "2.200",
              a: "3.750",
              ss: "1-1",
            },
          ],
        },
        match_odds_HT: {
          history: [
            {
              m: 0,
              h: 0,
              d: 0,
              a: 0,
              ss: 0,
            },
            {
              m: 0,
              h: 0,
              d: 0,
              a: 0,
              ss: 0,
            },
            {
              m: 0,
              h: 0,
              d: 0,
              a: 0,
              ss: 0,
            },
            {
              m: 0,
              h: "3.000",
              d: "2.050",
              a: "3.750",
              ss: null,
            },
            {
              m: 0,
              h: "3.000",
              d: "2.050",
              a: "3.750",
              ss: null,
            },
            {
              m: 2,
              h: "3.000",
              d: "2.050",
              a: "3.750",
              ss: null,
            },
            {
              m: 4,
              h: "3.000",
              d: "2.050",
              a: "3.750",
              ss: null,
            },
            {
              m: 5,
              h: "3.000",
              d: "2.000",
              a: "4.000",
              ss: "0-0",
            },
            {
              m: 9,
              h: "3.200",
              d: "1.952",
              a: "4.000",
              ss: "0-0",
            },
            {
              m: 12,
              h: "3.200",
              d: "1.909",
              a: "4.333",
              ss: "0-0",
            },
            {
              m: 14,
              h: "3.400",
              d: "1.833",
              a: "4.333",
              ss: "0-0",
            },
            {
              m: 15,
              h: "3.400",
              d: "1.800",
              a: "4.333",
              ss: "0-0",
            },
            {
              m: 16,
              h: "3.400",
              d: "1.800",
              a: "4.333",
              ss: "0-0",
            },
            {
              m: 17,
              h: "3.500",
              d: "1.727",
              a: "4.500",
              ss: "0-0",
            },
            {
              m: 18,
              h: "3.500",
              d: "1.727",
              a: "4.500",
              ss: "0-0",
            },
            {
              m: 20,
              h: "3.600",
              d: "1.666",
              a: "4.750",
              ss: "0-0",
            },
            {
              m: 21,
              h: "3.750",
              d: "1.666",
              a: "4.750",
              ss: "0-0",
            },
            {
              m: 22,
              h: "3.750",
              d: "1.666",
              a: "4.750",
              ss: "0-0",
            },
            {
              m: 24,
              h: "21.000",
              d: "4.000",
              a: "1.250",
              ss: "0-1",
            },
            {
              m: 26,
              h: "23.000",
              d: "4.333",
              a: "1.250",
              ss: "0-1",
            },
            {
              m: 28,
              h: "29.000",
              d: "4.333",
              a: "1.222",
              ss: "0-1",
            },
            {
              m: 30,
              h: "34.000",
              d: "4.500",
              a: "1.200",
              ss: "0-1",
            },
            {
              m: 32,
              h: "4.750",
              d: "1.400",
              a: "6.000",
              ss: "1-1",
            },
            {
              m: 34,
              h: "5.000",
              d: "1.363",
              a: "6.500",
              ss: "1-1",
            },
            {
              m: 36,
              h: "6.000",
              d: "1.285",
              a: "7.500",
              ss: "1-1",
            },
            {
              m: 38,
              h: "6.500",
              d: "1.250",
              a: "8.000",
              ss: "1-1",
            },
            {
              m: 39,
              h: "7.500",
              d: "1.181",
              a: "9.000",
              ss: "1-1",
            },
            {
              m: 42,
              h: "9.500",
              d: "1.125",
              a: "11.000",
              ss: "1-1",
            },
            {
              m: 44,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 46,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 48,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 50,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
            {
              m: 56,
              h: "12.000",
              d: "1.083",
              a: "15.000",
              ss: "1-1",
            },
          ],
        },
      },
      tips: [],
    },
    {
      id: "5739164",
      sport_id: "1",
      time: "1668871800",
      time_status: "1",
      league: {
        id: "250",
        name: "International Match",
        cc: null,
      },
      home: {
        id: "4215",
        name: "United Arab Emirates",
        image_id: "4727",
        cc: "ae",
      },
      away: {
        id: "7147",
        name: "Kazakhstan",
        image_id: "4772",
        cc: "kz",
      },
      ss: "1-0",
      timer: {
        tm: 44,
        ts: 51,
        tt: "1",
        ta: 0,
        md: 0,
      },
      scores: {
        2: {
          home: "1",
          away: "0",
        },
      },
      stats: {
        attacks: ["54", "35"],
        corners: ["0", "1"],
        dangerous_attacks: ["16", "14"],
        goals: ["1", "0"],
        off_target: ["2", "1"],
        on_target: ["3", "1"],
        penalties: ["0", "0"],
        possession_rt: ["58", "42"],
        redcards: ["0", "0"],
        substitutions: ["0", "0"],
        yellowcards: ["0", "0"],
      },
      extra: {
        length: 90,
        away_manager: {
          id: "43489",
          name: "Magomed Adiev",
          cc: "ru",
        },
        home_manager: {
          id: "5415",
          name: "Rodolfo Arruabarrena",
          cc: "ar",
        },
        numberofperiods: "2",
        periodlength: "45",
        stadium_data: {
          id: "2179",
          name: "Zayed Sports City Stadium",
          city: "Abu Dhabi",
          country: "United Arab Emirates",
          capacity: "43000",
          googlecoords: "24.4160706,54.4535959",
        },
      },
      events: [
        {
          id: "118493008",
          text: "7' - 1st Offside- Kazakhstan",
          homeOrAway: "A",
        },
        {
          id: "118493435",
          text: "9' - 1st Corner - Kazakhstan",
          symbolToShow: "⛳️",
          minuteToShow: "9' ",
          homeOrAway: "A",
        },
        {
          id: "118493746",
          text: "0:0 Cards 00:00 - 09:59",
          homeOrAway: "-",
        },
        {
          id: "118493747",
          text: "0:1 Corners 00:00 - 09:59",
          homeOrAway: "-",
        },
        {
          id: "118493748",
          text: "0:0 Goals 00:00 - 09:59",
          homeOrAway: "-",
        },
        {
          id: "118493902",
          text: "11' - 2nd Offside- Kazakhstan",
          homeOrAway: "A",
        },
        {
          id: "118494327",
          text: "13' - 1st Goal -   (United Arab Emirates) -",
          symbolToShow: "⚽️",
          minuteToShow: "13'",
          minuteSequential: 11200,
          brClock: "1T 13:00",
          homeOrAway: "H",
        },
        {
          id: "118495866",
          text: "0:0 Cards 10:00 - 19:59",
          homeOrAway: "-",
        },
        {
          id: "118495867",
          text: "0:0 Corners 10:00 - 19:59",
          homeOrAway: "-",
        },
        {
          id: "118495868",
          text: "1:0 Goals 10:00 - 19:59",
          homeOrAway: "-",
        },
        {
          id: "118497311",
          text: "0:0 Cards 20:00 - 29:59",
          homeOrAway: "-",
        },
        {
          id: "118497312",
          text: "0:0 Corners 20:00 - 29:59",
          homeOrAway: "-",
        },
        {
          id: "118497313",
          text: "0:0 Goals 20:00 - 29:59",
          homeOrAway: "-",
        },
        {
          id: "118497496",
          text: "32' - 3rd Offside- United Arab Emirates",
          homeOrAway: "H",
        },
        {
          id: "118499420",
          text: "0:0 Cards 30:00 - 39:59",
          homeOrAway: "-",
        },
        {
          id: "118499421",
          text: "0:0 Corners 30:00 - 39:59",
          homeOrAway: "-",
        },
        {
          id: "118499422",
          text: "0:0 Goals 30:00 - 39:59",
          homeOrAway: "-",
        },
      ],
      has_lineup: 0,
      inplay_created_at: "1668871272",
      inplay_updated_at: "1668874511",
      confirmed_at: "1668871062",
      bet365_id: "128336518",
      tm_stats: {
        avg_age: ["27.2", "28.0"],
        avg_market_value: [836000, 629000],
        foreigners: ["0", "3"],
        total_market_value: [23400000, 15730000],
      },
      missingplayers: {
        home: [],
        away: [],
      },
      allSS: {
        eventView: {
          ss: "1-0",
          timer: {
            tm: 44,
            ts: 51,
            tt: "1",
            ta: 0,
            md: 0,
          },
          fullName: "United Arab Emirates x Kazakhstan",
        },
        inplayEvents_v1: {
          ss: "error",
          timer: "error",
          fullName: "error",
        },
        inplayEvents_v3: {
          ss: "error",
          timer: "error",
          fullName: "error",
        },
        inPlayEventsBSF: {
          ss: "1-0",
          timer: {
            tm: 44,
            ts: 35,
            tt: "1",
            ta: 0,
            md: 0,
          },
          fullName: "United Arab Emirates x Kazakhstan",
        },
      },
      score_ht: "",
      score_ft: "1-0",
      score: "1-0",
      totalGoals_home: 1,
      totalGoals_away: 0,
      totalGoals: 1,
      totalGoalsHT_home: 1,
      totalGoalsHT_away: 0,
      totalGoalsHT: 1,
      updated_at: "2022-11-19T16:15:20.514Z",
      brClock: "1T 44:51",
      minuteClock: "45'",
      enClock: "1st 44:51",
      clock: {
        brClock: "1T 44:51",
        period: "1T",
        minute: 44,
        second: 51,
      },
      fullName: "United Arab Emirates v Kazakhstan",
      fullName_fromBFdictionary: "United Arab Emirates v Kazakhstan",
      fullNameStringedWithClock: "United Arab Emirates 1-0 Kazakhstan (1T 44:51)",
      stringedGameWithRedcards: "United Arab Emirates 1-0 Kazakhstan",
      stringedGameWithRedcardsAndClock: "United Arab Emirates 1-0 Kazakhstan (1T 44:51)",
      stringedGameWithRedcardsAndClock_en: "United Arab Emirates 1-0 Kazakhstan (1st 44:51)",
      stringedGameWithRedcards_boldScore: "United Arab Emirates <b>1-0</b> Kazakhstan",
      minute: 45,
      bsf_inplay_endpoint_rawData_v1_thisEvent: null,
      bsf_inplay_endpoint_rawData_v1_thisEvent_date_of_insertion: "2022-11-19T16:15:21.743Z",
      bsf_inplay_endpoint_rawData_v3_thisEvent: null,
      bsf_inplay_endpoint_rawData_v3_thisEvent_date_of_insertion: "2022-11-19T16:15:21.743Z",
      points: {
        total_shots_home: 5,
        total_shots_away: 2,
        total_shots_home_ht: 0,
        total_shots_away_ht: 0,
        shots_off_in: "5-2 [3-1]",
        shots_off_in_ht: "0-0 [0-0]",
        totalPoints: "12.9",
        points_home: "8.3",
        points_away: "4.7",
        points_home_ht: "0.0",
        points_away_ht: "0.0",
        points_home_2t: "8.3",
        points_away_2t: "4.7",
        table_position_home: "",
        table_position_away: "",
        round: "",
        league_name: "International Match",
        league_cc: null,
        league_flag: "🏳",
        placar_ft: "1-0",
        datt_home: 16,
        datt_away: 14,
        datt_per_minute: 0.7,
        att_home: 54,
        att_away: 35,
        on_target_home: 3,
        on_target_away: 1,
        off_target_home: 2,
        off_target_away: 1,
        datt_home_ht: 0,
        datt_away_ht: 0,
        att_home_ht: 0,
        att_away_ht: 0,
        corners_home: "0",
        corners_away: "1",
        possession_home: 58,
        possession_away: 42,
        yellowcards_home: "0",
        yellowcards_away: "0",
        redcards_home: "0",
        redcards_away: "0",
        on_target_home_ht: 0,
        on_target_away_ht: 0,
        off_target_home_ht: 0,
        off_target_away_ht: 0,
        power_index_ht: "H➡️NaN",
        power_index: "H➡️1.78",
        power_index_side: "H",
        power_index_factor: 1.7849462365591398,
        power_index_2t: "H➡️1.78",
        pointsIndex: "0.29",
        pointsIndexColoredSymbol: "🔴",
        pointsStringedWithBars: "||||||||-||||",
        pointsStringedWithPeriod: "········x····",
        pointsHistory: {
          dattHist: [
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 2,
              h: 3,
              a: 0,
            },
            {
              m: 4,
              h: 3,
              a: 0,
            },
            {
              m: 6,
              h: 3,
              a: 1,
            },
            {
              m: 8,
              h: 4,
              a: 2,
            },
            {
              m: 10,
              h: 4,
              a: 4,
            },
            {
              m: 12,
              h: 5,
              a: 4,
            },
            {
              m: 14,
              h: 5,
              a: 4,
            },
            {
              m: 16,
              h: 5,
              a: 6,
            },
            {
              m: 20,
              h: 6,
              a: 7,
            },
            {
              m: 21,
              h: 6,
              a: 8,
            },
            {
              m: 22,
              h: 7,
              a: 8,
            },
            {
              m: 24,
              h: 9,
              a: 9,
            },
            {
              m: 26,
              h: 9,
              a: 9,
            },
            {
              m: 29,
              h: 10,
              a: 9,
            },
            {
              m: 30,
              h: 11,
              a: 9,
            },
            {
              m: 32,
              h: 13,
              a: 9,
            },
            {
              m: 34,
              h: 13,
              a: 10,
            },
            {
              m: 36,
              h: 13,
              a: 10,
            },
            {
              m: 38,
              h: 13,
              a: 12,
            },
            {
              m: 44,
              h: 16,
              a: 14,
            },
          ],
          attHist: [
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 0,
            },
            {
              m: 0,
              h: 0,
              a: 1,
            },
            {
              m: 2,
              h: 3,
              a: 1,
            },
            {
              m: 4,
              h: 6,
              a: 2,
            },
            {
              m: 6,
              h: 7,
              a: 5,
            },
            {
              m: 8,
              h: 10,
              a: 7,
            },
            {
              m: 10,
              h: 13,
              a: 9,
            },
            {
              m: 12,
              h: 15,
              a: 9,
            },
            {
              m: 14,
              h: 15,
              a: 9,
            },
            {
              m: 16,
              h: 16,
              a: 11,
            },
            {
              m: 20,
              h: 27,
              a: 14,
            },
            {
              m: 21,
              h: 29,
              a: 15,
            },
            {
              m: 22,
              h: 29,
              a: 16,
            },
            {
              m: 24,
              h: 31,
              a: 17,
            },
            {
              m: 26,
              h: 31,
              a: 18,
            },
            {
              m: 29,
              h: 37,
              a: 19,
            },
            {
              m: 30,
              h: 40,
              a: 21,
            },
            {
              m: 32,
              h: 43,
              a: 23,
            },
            {
              m: 34,
              h: 44,
              a: 25,
            },
            {
              m: 36,
              h: 48,
              a: 28,
            },
            {
              m: 38,
              h: 48,
              a: 29,
            },
            {
              m: 44,
              h: 54,
              a: 35,
            },
          ],
        },
      },
      event_odds: {
        eventId_bsf: "5739164",
        isEndedEvent: 0,
        updated_at: "2022-11-19T16:09:29.065Z",
        source: "ZezinhoMicroserviceBSFbot",
        source_v: 21,
        odds_summary: {
          start: {
            home_odd: 1.95,
            draw_odd: 3.4,
            away_odd: 3.3,
            ss: null,
            t: null,
            add_time: "1668597821",
            home_prob: 51.3,
            draw_prob: 29.4,
            away_prob: 30.3,
            over_odd: 2,
            handicap: 2.25,
          },
          kickOff: {
            home_odd: 2.05,
            draw_odd: 3.4,
            away_odd: 3.25,
            ss: "0-0",
            t: "1",
            add_time: "1668871924",
            home_prob: 48.8,
            draw_prob: 29.4,
            away_prob: 30.8,
            over_odd: 1.875,
            handicap: 2,
          },
          end: {
            home_odd: 1.25,
            draw_odd: 5,
            away_odd: 17,
            ss: "1-0",
            t: "38",
            add_time: "1668874130",
            home_prob: 80,
            draw_prob: 20,
            away_prob: 5.9,
            over_odd: 1.875,
            handicap: 2,
          },
        },
        odds: {
          moneyLine_1_1: {
            last: {
              home_odd: "1.222",
              draw_odd: "5.000",
              away_odd: "17.000",
              ss: "1-0",
              time_str: "38",
              add_time: "1668874156",
            },
          },
          moneyLineHT_1_8: {
            last: {
              home_odd: "1.040",
              draw_odd: "13.000",
              away_odd: "151.000",
              ss: "1-0",
              time_str: "38",
              add_time: "1668874130",
            },
          },
          goal_line_1_3: {
            last: {
              over_odd: "1.925",
              handicap: "2",
              under_odd: "1.925",
              ss: "1-0",
              time_str: "39",
              add_time: "1668874161",
            },
          },
          ht_goal_line_1_6: {
            last: {
              over_odd: "5.900",
              handicap: "1.5",
              under_odd: "1.140",
              ss: "1-0",
              time_str: "39",
              add_time: "1668874161",
            },
          },
        },
        favorite_H_A: "H",
        favorite_odd: 2.05,
        favorite_category: 0,
        favorite_symbol: "",
        overNextGolHT: 5.9,
        overNextGol: 1.425,
      },
      eventsToShow: [
        {
          id: "118494327",
          text: "13' - 1st Goal -   (United Arab Emirates) -",
          symbolToShow: "⚽️",
          minuteToShow: "13'",
          minuteSequential: 11200,
          brClock: "1T 13:00",
          homeOrAway: "H",
        },
      ],
      eventsToShow_onlyGoals: [
        {
          id: "118494327",
          text: "13' - 1st Goal -   (United Arab Emirates) -",
          symbolToShow: "⚽️",
          minuteToShow: "13'",
          minuteSequential: 11200,
          brClock: "1T 13:00",
          homeOrAway: "H",
        },
      ],
      eventsToShow_onlyRedCards: [],
      pointsSlices: {
        minutes_array: ["05'", "10'", "15'", "20'", "25'", "30'", "35'", "40'", "45'"],
        minutesToShow_array: ["🔴", "🟢", "🔴", "🟢", "🟡", "🔴", "🔴", "🔴", "🟡"],
        minutesToShow_array2: ["-", "+", "-", "+", "~", "-", "-", "-", "~"],
        minutesToShow_stringed: "🔴🟢🔴🟢🟡🔴🔴🔴🟡",
        minutesToShow_stringed2: "- + - + ~ - - - ~ ",
        minutesOfGoalsToShow_array: [0, 0, 1, 0, 0, 0, 0, 0, 0],
        minutesOfHomeGoalsToShow_array: ["", "", "⚽️", "", "", "", "", "", ""],
        minutesOfAwayGoalsToShow_array: ["", "", "", "", "", "", "", "", ""],
        minutesOfHomeGoalsToShow_array_stringed: "▫️▫️⚽️▫️▫️▫️▫️▫️▫️󠀠󠀠󠀠󠀠|",
        minutesOfAwayGoalsToShow_array_stringed: "▫️▫️▫️▫️▫️▫️▫️▫️▫️󠀠󠀠󠀠󠀠|",
        homeGoalsSlices: [],
        awayGoalsSlices: [],
        minutesOfRedCardsToShow_array: [],
        minutesOfHomeRedCardsToShow_array: ["", "", "", "", "", "", "", "", ""],
        minutesOfAwayRedCardsToShow_array: ["", "", "", "", "", "", "", "", ""],
        minutesOfHomeRedCardsAndGoalsToShow_array: ["", "", "⚽️", "", "", "", "", "", ""],
        minutesOfAwayRedCardsAndGoalsToShow_array: ["", "", "", "", "", "", "", "", ""],
        pointsSlices: [
          {
            slice_minute: 5,
            home_points: 1.1,
            away_points: 0.1,
            total_points: 1.2,
          },
          {
            slice_minute: 10,
            home_points: 1.4,
            away_points: 0.6,
            total_points: 2,
          },
          {
            slice_minute: 15,
            home_points: 1.25,
            away_points: 0.15,
            total_points: 1.4,
          },
          {
            slice_minute: 20,
            home_points: 0.55,
            away_points: 2.05,
            total_points: 2.6,
          },
          {
            slice_minute: 25,
            home_points: 1.15,
            away_points: 0.35,
            total_points: 1.5,
          },
          {
            slice_minute: 30,
            home_points: 0.45,
            away_points: 0.15,
            total_points: 0.6,
          },
          {
            slice_minute: 35,
            home_points: 0.6,
            away_points: 0.35,
            total_points: 0.95,
          },
          {
            slice_minute: 40,
            home_points: 0.35,
            away_points: 0.6,
            total_points: 0.95,
          },
          {
            slice_minute: 45,
            home_points: 1.4,
            away_points: 0.3,
            total_points: 1.7,
          },
        ],
        points_per_Minutes_Slices: ["0.24", "0.40", "0.28", "0.52", "0.30", "0.12", "0.19", "0.19", "0.34"],
        home_slice_points_array: [1.1, 1.4, 1.25, 0.55, 1.15, 0.45, 0.6, 0.35, 1.4],
        home_slice_points_array_zeroFilled: [1.1, 1.4, 1.25, 0.55, 1.15, 0.45, 0.6, 0.35, 1.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        home_slice_only_datt_points_array_zeroFilled: [3, 1, 1, 1, 3, 1, 3, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        away_slice_points_array: [0.1, 0.6, 0.15, 2.05, 0.35, 0.15, 0.35, 0.6, 0.3],
        away_slice_points_array_reverse: [-0.1, -0.6, -0.15, -2.05, -0.35, -0.15, -0.35, -0.6, -0.3],
        away_slice_points_array_reverse_zeroFilled: [-0.1, -0.6, -0.15, -2.05, -0.35, -0.15, -0.35, -0.6, -0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        away_slice_only_datt_points_array_reverse_zeroFilled: [0, -3, -1, -3, -2, 0, -1, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        home_slice_points_array_stringed: "◾️◾️◾️▪️◾️▫️▪️▫️◾️",
        away_slice_points_array_stringed: "▫️▪️▫️◼️▫️▫️▫️▪️▫️",
        total_points_array: [1.2, 2, 1.4, 2.6, 1.5, 0.6, 0.95, 0.95, 1.7],
        total_points_array_stringed: "1.2 2.0 1.4 2.6 1.5 0.6 0.9 0.9 1.7 ",
        goals_slices_array: [0, 0, 1, 0, 0, 0, 0, 0, 0],
        powerIndex_array: [11, 2.33, 8.33, -3.73, 3.29, 3, 1.71, -1.71, 4.67],
        powerIndexToShow_stringed: "⏩️⏩️⏩️⏪️️️⏩️⏩️▶️◀️️️⏩️",
        powerIndexToShow_stringed2: "➡➡➡⬅➡➡▶️◀️️️➡",
        powerIndexToShow_stringed_home: "➡➡➡▫️➡➡▶️▫️➡",
        powerIndexToShow_stringed_away: "▫️▫️▫️⬅▫️▫️▫️◀️️️▫️",
        powerIndexToShow_stringed_HhAa: "H H H A H H h a H ",
        powerIndexToShow_stringed_HhAa_merged: "H- H+ H- A+ H~ H- h- a- H~ ",
        maxMinuteWithData: 43,
        points_per_min_color_symbols: "🟡 🟡 🟡 🟡 🟡",
        points_per_min_color_symbol: "🟡",
        total_points: 12.899999999999997,
        points_per_min: "0.30",
        points_per_min_color: "tomato",
      },
      timeStamps: {
        time_stringed_ISO_8601: "2022-11-19T15:30:00.000Z",
        time_stringed_withZoneBR: "19/Nov 12:30 GMT-0300",
        timeUntilKickOff_stringed: "-45m",
      },
      bf_mostSimilarComparison: {
        eventMostSimilar: {
          id: "31917216",
          name: "UAE v Kazakhstan",
          marketCount: "",
        },
        greaterSimilarityValue: 0.48,
        greaterSimilarityTop5Rank: [
          {
            eventName: "UAE v Kazakhstan",
            eventId: "31917216",
            eventSimilarityValue: 0.48,
          },
          {
            eventName: "Belenenses v Boavista",
            eventId: "31904238",
            eventCc: "PT",
            eventSimilarityValue: 0.33,
          },
          {
            eventName: "Pacos Ferreira v Casa Pia",
            eventId: "31904252",
            eventCc: "PT",
            eventSimilarityValue: 0.33,
          },
          {
            eventName: "North Macedonia v Azerbaijan",
            eventId: "31917135",
            eventSimilarityValue: 0.3,
          },
          {
            eventName: "Peru v Bolivia",
            eventId: "31915674",
            eventSimilarityValue: 0.18,
          },
        ],
        bf_odds: {
          match_odds: {
            marketId: "1.206606038",
            marketName: "Match Odds",
            totalMatched: 2046.28,
            home_odd: 2.24,
            draw_odd: 3.05,
            away_odd: 3.5,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-18T09:09:10.133Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_2_5: {
            marketId: "1.206606083",
            marketName: "Over/Under 2.5 Goals",
            totalMatched: 25.83,
            under_odd: 1.55,
            over_odd: 2.38,
            over_odd_lastPriceTraded: 2.2,
            isMarketDataDelayed: true,
            betDelay: 0,
            lastMatchTime: "2022-11-18T00:31:49.612Z",
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_1_5: {
            marketId: "1.206606086",
            marketName: "Over/Under 1.5 Goals",
            totalMatched: 0,
            under_odd: 2.88,
            over_odd: 1.45,
            isMarketDataDelayed: true,
            betDelay: 0,
            status: "OPEN",
            runners_status: "ACTIVE",
          },
          over_under_HT_0_5: {
            marketId: "1.206606041",
            marketName: "First Half Goals 0.5",
            totalMatched: 0,
            under_odd: 2.5,
            over_odd: 1.47,
            isMarketDataDelayed: true,
            betDelay: 0,
            status: "OPEN",
            runners_status: "ACTIVE",
          },
        },
      },
      bf_mostSimilarComparison_Live: {
        eventMostSimilar: {
          id: "31917216",
          name: "UAE v Kazakhstan",
          marketCount: 22,
        },
        totalInPlayEvents: 192,
        mostSimilarRankMaxLength: 5,
        greaterSimilarityValue: 0.5,
        greaterSimilarityRank: [
          {
            id: "31917216",
            name: "UAE v Kazakhstan",
            sim_value: 0.5,
          },
          {
            id: "31906285",
            name: "Cove Rangers v Morton",
            cc: "GB",
            sim_value: 0.35,
          },
          {
            id: "31911089",
            name: "LR Vicenza Virtus v Triestina",
            cc: "IT",
            sim_value: 0.35,
          },
          {
            id: "31920029",
            name: "Scotland U19 v Kazakhstan U19",
            sim_value: 0.35,
          },
          {
            id: "31920241",
            name: "Spain U19 v Japan U19",
            sim_value: 0.2,
          },
        ],
      },
      bfOdds_fromPropertieCache: {
        bsf_id: "5739164",
        bsf_fullName: "United Arab Emirates v Kazakhstan",
        bsf_time: "1668873600",
        bfEventId: "31917216",
        bf_eventName: "UAE v Kazakhstan",
        bf_homeOdd_pregame: 2.22,
        bf_drawOdd_pregame: 3.15,
        bf_awayOdd_pregame: 3.6,
        bf_overOdd2_5_pregame: 2.48,
        bf_overOdd0_5HT_pregame: 1.53,
      },
      textsToShow: {
        overOdds: {
          eventOddsSummaryTextMsgParsedToSend_ML: "2.05|3|3.25",
          eventOddsSummaryTextMsgParsedToSend_GoalLine: " 2.25@2.0",
          eventOddsTextMsgParsedToSend_GoalLine: " 2@1.9 (1.43)",
          eventOddsTextMsgParsedToSend_GoalLineHT: "1.5ht@5.9 (5.90)",
        },
        bfUpcomingEventOdds: "2.5@2.38 0.5ht@1.47",
        pointsStringedWithFavoriteSymbol: "  ········x····",
      },
      eventTextMsgParsedToSendWithTeamOdds:
        "\n(1T 44:51)  <code>1.25</code> United Arab Emirates <b>1-0</b> Kazakhstan <code>17</code>  [5739164] \n12.9 [8 v 5]  5🥅2  3🎯1   16💥14 (0.7)   58%42  0.29🔴  H➡️1.78\n2.05|3|3.25  2.25@2.0  ⚽ 2@1.9 (1.43)   1.5ht@5.9 (5.90) bf{2.5@2.38 0.5ht@1.47}  ········x····\n🔴🟢🔴🟢🟡🔴🔴🔴🟡\n▫️▫️⚽️▫️▫️▫️▫️▫️▫️󠀠󠀠󠀠󠀠|\n◾️◾️◾️▪️◾️▫️▪️▫️◾️\n▫️▪️▫️◼️▫️▫️▫️▪️▫️\n▫️▫️▫️▫️▫️▫️▫️▫️▫️󠀠󠀠󠀠󠀠|\n",
      has_selected_team: false,
      selectedTeam: {
        has_selected_team: false,
        selected_team_homeOrAway: "",
        team: {},
        odd: 0,
      },
      selectedTeamMaxOdd: {
        has_selected_team: false,
        selected_team_homeOrAway: "",
        team: {},
        odd: 0,
      },
      bsfEventsHistory: {
        h2h: [],
        home: [
          {
            id: "5890794",
            time: "1668612600",
            ss: "0-5",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "United Arab Emirates 0-5 (0-4) Argentina",
            league_name: "International Match",
            home_name: "United Arab Emirates",
            away_name: "Argentina",
            fullScore: "0-5 (0-4)",
            totalGoals: 5,
            totalGoalsHT: 4,
            resultCol: "A",
            tm_stats: {
              home_market_value: 23550000,
              away_market_value: 633200000,
            },
            result: "L",
          },
          {
            id: "5677260",
            time: "1664290800",
            ss: "0-4",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "United Arab Emirates 0-4 (0-3) Venezuela",
            league_name: "International Match",
            home_name: "United Arab Emirates",
            away_name: "Venezuela",
            fullScore: "0-4 (0-3)",
            totalGoals: 4,
            totalGoalsHT: 3,
            resultCol: "A",
            tm_stats: {},
            result: "L",
          },
          {
            id: "5603772",
            time: "1663948800",
            ss: "1-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Paraguay 1-0 (0-0) United Arab Emirates",
            league_name: "International Match",
            home_name: "Paraguay",
            away_name: "United Arab Emirates",
            fullScore: "1-0 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {
              home_market_value: 58850000,
              away_market_value: 19500000,
            },
            result: "L",
          },
          {
            id: "4843311",
            time: "1654624800",
            ss: "1-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "United Arab Emirates 1-2 (0-0) Australia",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "Australia",
            fullScore: "1-2 (0-0)",
            totalGoals: 3,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {
              home_market_value: 18250000,
              away_market_value: 40280000,
            },
            result: "L",
          },
          {
            id: "5088520",
            time: "1653838800",
            ss: "1-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "United Arab Emirates 1-1 (1-0) Gambia",
            league_name: "International Match",
            home_name: "United Arab Emirates",
            away_name: "Gambia",
            fullScore: "1-1 (1-0)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {},
            result: "D",
          },
          {
            id: "3715843",
            time: "1648561500",
            ss: "1-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "United Arab Emirates 1-0 (0-0) South Korea",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "South Korea",
            fullScore: "1-0 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {
              home_market_value: 17100000,
              away_market_value: 131880000,
            },
            result: "W",
          },
          {
            id: "3715842",
            time: "1648141200",
            ss: "1-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Iraq 1-0 (0-0) United Arab Emirates",
            league_name: "Asia - World Cup Qualifying",
            home_name: "Iraq",
            away_name: "United Arab Emirates",
            fullScore: "1-0 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {
              home_market_value: 11530000,
              away_market_value: 18000000,
            },
            result: "L",
          },
          {
            id: "3715841",
            time: "1643725800",
            ss: "1-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "🟥 Iran 1-0 (1-0) United Arab Emirates",
            league_name: "Asia - World Cup Qualifying",
            home_name: "Iran",
            away_name: "United Arab Emirates",
            fullScore: "1-0 (1-0)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {
              home_market_value: 76600000,
              away_market_value: 13530000,
            },
            result: "L",
          },
          {
            id: "3715840",
            time: "1643295600",
            ss: "2-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "United Arab Emirates 2-0 (1-0) Syria",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "Syria",
            fullScore: "2-0 (1-0)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {
              home_market_value: 20000000,
              away_market_value: 14650000,
            },
            result: "W",
          },
          {
            id: "4421655",
            time: "1639162800",
            ss: "5-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Qatar 5-0 (5-0) United Arab Emirates",
            league_name: "FIFA Arab Cup",
            home_name: "Qatar",
            away_name: "United Arab Emirates",
            fullScore: "5-0 (5-0)",
            totalGoals: 5,
            totalGoalsHT: 5,
            resultCol: "H",
            tm_stats: {
              home_market_value: 17680000,
              away_market_value: 16530000,
            },
            result: "L",
          },
          {
            id: "3998025",
            time: "1638802800",
            ss: "1-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Tunisia 1-0 (1-0) United Arab Emirates",
            league_name: "FIFA Arab Cup",
            home_name: "Tunisia",
            away_name: "United Arab Emirates",
            fullScore: "1-0 (1-0)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {
              home_market_value: 32700000.000000004,
              away_market_value: 16530000,
            },
          },
          {
            id: "3998029",
            time: "1638547200",
            ss: "0-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Mauritania 0-1 (0-0) United Arab Emirates",
            league_name: "FIFA Arab Cup",
            home_name: "Mauritania",
            away_name: "United Arab Emirates",
            fullScore: "0-1 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {
              home_market_value: 2750000,
              away_market_value: 16530000,
            },
          },
          {
            id: "3998030",
            time: "1638298800",
            ss: "2-1",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "🟥 United Arab Emirates 2-1 (2-0) Syria",
            league_name: "FIFA Arab Cup",
            home_name: "United Arab Emirates",
            away_name: "Syria",
            fullScore: "2-1 (2-0)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {},
          },
          {
            id: "3715839",
            time: "1637064000",
            ss: "0-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Lebanon 0-1 (0-0) United Arab Emirates",
            league_name: "Asia - World Cup Qualifying",
            home_name: "Lebanon",
            away_name: "United Arab Emirates",
            fullScore: "0-1 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {
              home_market_value: 3930000,
              away_market_value: 23980000,
            },
          },
          {
            id: "3715838",
            time: "1636628400",
            ss: "1-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "South Korea 1-0 (1-0) United Arab Emirates",
            league_name: "Asia - World Cup Qualifying",
            home_name: "South Korea",
            away_name: "United Arab Emirates",
            fullScore: "1-0 (1-0)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {
              home_market_value: 129250000,
              away_market_value: 22780000,
            },
          },
          {
            id: "3715837",
            time: "1634057100",
            ss: "2-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "United Arab Emirates 2-2 (1-0) Iraq",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "Iraq",
            fullScore: "2-2 (1-0)",
            totalGoals: 4,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {
              home_market_value: 22430000,
              away_market_value: 8480000,
            },
          },
          {
            id: "3715836",
            time: "1633625100",
            ss: "0-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "United Arab Emirates 0-1 (0-0) Iran",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "Iran",
            fullScore: "0-1 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "A",
            tm_stats: {
              home_market_value: 22480000,
              away_market_value: 75750000,
            },
          },
          {
            id: "3715835",
            time: "1631030400",
            ss: "1-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Syria 1-1 (0-1) United Arab Emirates",
            league_name: "Asia - World Cup Qualifying",
            home_name: "Syria",
            away_name: "United Arab Emirates",
            fullScore: "1-1 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {
              home_market_value: 9330000,
              away_market_value: 22480000,
            },
          },
          {
            id: "3715834",
            time: "1630601100",
            ss: "0-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "United Arab Emirates 0-0 (0-0) Lebanon",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "Lebanon",
            fullScore: "0-0 (0-0)",
            totalGoals: 0,
            totalGoalsHT: 0,
            resultCol: "D",
            tm_stats: {
              home_market_value: 22430000,
              away_market_value: 4780000,
            },
          },
          {
            id: "3609982",
            time: "1623775500",
            ss: "3-2",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "United Arab Emirates 3-2 (2-0) Vietnam",
            league_name: "Asia - World Cup Qualifying",
            home_name: "United Arab Emirates",
            away_name: "Vietnam",
            fullScore: "3-2 (2-0)",
            totalGoals: 5,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {
              home_market_value: 22380000,
              away_market_value: 5650000,
            },
          },
        ],
        away: [
          {
            id: "5760123",
            time: "1668603600",
            ss: "2-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Uzbekistan 2-0 (2-0) Kazakhstan",
            league_name: "International Match",
            home_name: "Uzbekistan",
            away_name: "Kazakhstan",
            fullScore: "2-0 (2-0)",
            totalGoals: 2,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {
              home_market_value: 27200000,
              away_market_value: 15730000,
            },
            result: "L",
          },
          {
            id: "4845704",
            time: "1664121600",
            ss: "3-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Azerbaijan 3-0 (0-0) Kazakhstan 🟥",
            league_name: "UEFA Nations League C",
            home_name: "Azerbaijan",
            away_name: "Kazakhstan",
            fullScore: "3-0 (0-0)",
            totalGoals: 3,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {
              home_market_value: 15500000,
              away_market_value: 17150000,
            },
            result: "L",
          },
          {
            id: "4845703",
            time: "1663855200",
            ss: "2-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "🟥 Kazakhstan 2-1 (1-1) Belarus",
            league_name: "UEFA Nations League C",
            home_name: "Kazakhstan",
            away_name: "Belarus",
            fullScore: "2-1 (1-1)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {
              home_market_value: 17150000,
              away_market_value: 12450000,
            },
            result: "W",
          },
          {
            id: "4845702",
            time: "1655128800",
            ss: "2-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 2-1 (2-0) Slovakia 🟥",
            league_name: "UEFA Nations League",
            home_name: "Kazakhstan",
            away_name: "Slovakia",
            fullScore: "2-1 (2-0)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "H",
            tm_stats: {
              home_market_value: 14530000,
              away_market_value: 132650000,
            },
            result: "W",
          },
          {
            id: "4845701",
            time: "1654886700",
            ss: "1-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Belarus 1-1 (0-1) Kazakhstan",
            league_name: "UEFA Nations League",
            home_name: "Belarus",
            away_name: "Kazakhstan",
            fullScore: "1-1 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {
              home_market_value: 14200000,
              away_market_value: 14530000,
            },
            result: "D",
          },
          {
            id: "4845700",
            time: "1654541100",
            ss: "0-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Slovakia 0-1 (0-1) Kazakhstan",
            league_name: "UEFA Nations League",
            home_name: "Slovakia",
            away_name: "Kazakhstan",
            fullScore: "0-1 (0-1)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {
              home_market_value: 127350000,
              away_market_value: 15350000,
            },
            result: "W",
          },
          {
            id: "4845699",
            time: "1654264800",
            ss: "2-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 2-0 (0-0) Azerbaijan",
            league_name: "UEFA Nations League",
            home_name: "Kazakhstan",
            away_name: "Azerbaijan",
            fullScore: "2-0 (0-0)",
            totalGoals: 2,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {},
            result: "W",
          },
          {
            id: "4459550",
            time: "1648562400",
            ss: "5-5",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 0-1 (0-1) Moldova",
            league_name: "UEFA Nations League",
            home_name: "Kazakhstan",
            away_name: "Moldova",
            fullScore: "0-1 (0-1)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {
              home_market_value: 23030000,
              away_market_value: 11900000,
            },
            result: "L",
          },
          {
            id: "4459548",
            time: "1648141200",
            ss: "1-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Moldova 1-2 (1-0) Kazakhstan",
            league_name: "UEFA Nations League",
            home_name: "Moldova",
            away_name: "Kazakhstan",
            fullScore: "1-2 (1-0)",
            totalGoals: 3,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {
              home_market_value: 11750000,
              away_market_value: 25530000,
            },
            result: "W",
          },
          {
            id: "4320477",
            time: "1637067600",
            ss: "1-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "Kazakhstan 1-0 (1-0) Tajikistan",
            league_name: "International Match",
            home_name: "Kazakhstan",
            away_name: "Tajikistan",
            fullScore: "1-0 (1-0)",
            totalGoals: 1,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {
              home_market_value: 19550000,
              away_market_value: 5480000,
            },
            result: "W",
          },
          {
            id: "3016663",
            time: "1636832700",
            ss: "8-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "France 8-0 (3-0) Kazakhstan",
            league_name: "Europe - World Cup Qualifying",
            home_name: "France",
            away_name: "Kazakhstan",
            fullScore: "8-0 (3-0)",
            totalGoals: 8,
            totalGoalsHT: 3,
            resultCol: "H",
            tm_stats: {
              home_market_value: 945800000,
              away_market_value: 20400000,
            },
          },
          {
            id: "3016603",
            time: "1634047200",
            ss: "0-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 0-2 (0-1) Finland",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Kazakhstan",
            away_name: "Finland",
            fullScore: "0-2 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {
              home_market_value: 20750000,
              away_market_value: 37050000,
            },
          },
          {
            id: "3017081",
            time: "1633784400",
            ss: "0-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 0-2 (0-1) Bosnia-Herzegovina",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Kazakhstan",
            away_name: "Bosnia-Herzegovina",
            fullScore: "0-2 (0-1)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "A",
            tm_stats: {
              home_market_value: 20750000,
              away_market_value: 53500000,
            },
          },
          {
            id: "3017080",
            time: "1631040300",
            ss: "2-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Bosnia-Herzegovina 2-2 (0-0) Kazakhstan",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Bosnia-Herzegovina",
            away_name: "Kazakhstan",
            fullScore: "2-2 (0-0)",
            totalGoals: 4,
            totalGoalsHT: 0,
            resultCol: "D",
            tm_stats: {
              home_market_value: 87300000,
              away_market_value: 22050000,
            },
          },
          {
            id: "3016600",
            time: "1630760400",
            ss: "1-0",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Finland 1-0 (0-0) Kazakhstan",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Finland",
            away_name: "Kazakhstan",
            fullScore: "1-0 (0-0)",
            totalGoals: 1,
            totalGoalsHT: 0,
            resultCol: "H",
            tm_stats: {
              home_market_value: 41350000,
              away_market_value: 22050000,
            },
          },
          {
            id: "3016851",
            time: "1630504800",
            ss: "2-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 2-2 (0-1) Ukraine",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Kazakhstan",
            away_name: "Ukraine",
            fullScore: "2-2 (0-1)",
            totalGoals: 4,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {
              home_market_value: 22550000,
              away_market_value: 195900000,
            },
          },
          {
            id: "3578727",
            time: "1622822400",
            ss: "4-0",
            time_status: "3",
            has_lineup: 0,
            stringedGameWithRedcards: "North Macedonia 4-0 (1-0) Kazakhstan 🟥",
            league_name: "International Match",
            home_name: "North Macedonia",
            away_name: "Kazakhstan",
            fullScore: "4-0 (1-0)",
            totalGoals: 4,
            totalGoalsHT: 1,
            resultCol: "H",
            tm_stats: {
              home_market_value: 61800000,
              away_market_value: 18830000,
            },
          },
          {
            id: "3016850",
            time: "1617216300",
            ss: "1-1",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Ukraine 1-1 (1-0) Kazakhstan",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Ukraine",
            away_name: "Kazakhstan",
            fullScore: "1-1 (1-0)",
            totalGoals: 2,
            totalGoalsHT: 1,
            resultCol: "D",
            tm_stats: {
              home_market_value: 127400000,
              away_market_value: 24750000,
            },
          },
          {
            id: "3016660",
            time: "1616936400",
            ss: "0-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "Kazakhstan 0-2 (0-2) France",
            league_name: "Europe - World Cup Qualifying",
            home_name: "Kazakhstan",
            away_name: "France",
            fullScore: "0-2 (0-2)",
            totalGoals: 2,
            totalGoalsHT: 2,
            resultCol: "A",
            tm_stats: {
              home_market_value: 24750000,
              away_market_value: 1070000000,
            },
          },
          {
            id: "2230165",
            time: "1605711600",
            ss: "1-2",
            time_status: "3",
            has_lineup: 1,
            stringedGameWithRedcards: "🟥 Kazakhstan 1-2 (1-1) Lithuania",
            league_name: "UEFA Nations League",
            home_name: "Kazakhstan",
            away_name: "Lithuania",
            fullScore: "1-2 (1-1)",
            totalGoals: 3,
            totalGoalsHT: 2,
            resultCol: "A",
            tm_stats: {},
          },
        ],
        last10stats: {
          h2h: {
            total: 0,
            totalGoals: 0,
            o0_5: 0,
            o1_5: 0,
            o2_5: 0,
            o3_5: 0,
            o0_5ht: 0,
            o1_5ht: 0,
            o2_5ht: 0,
            o0_52t: 0,
            o1_52t: 0,
            o2_52t: 0,
            gols1t: 0,
            gols2t: 0,
            gols1t_pct: 0,
            gols2t_pct: 0,
          },
          home: {
            total: 10,
            totalGoals: 25,
            o0_5: 10,
            o1_5: 6,
            o2_5: 4,
            o3_5: 3,
            o0_5ht: 6,
            o1_5ht: 3,
            o2_5ht: 3,
            o0_52t: 8,
            o1_52t: 1,
            o2_52t: 1,
            gols1t: 15,
            gols2t: 10,
            gols1t_pct: 0.6,
            gols2t_pct: 0.4,
            scored: 4,
            cleanSheet: 2,
          },
          away: {
            total: 10,
            totalGoals: 21,
            o0_5: 10,
            o1_5: 7,
            o2_5: 4,
            o3_5: 0,
            o0_5ht: 8,
            o1_5ht: 3,
            o2_5ht: 0,
            o0_52t: 6,
            o1_52t: 3,
            o2_52t: 1,
            gols1t: 11,
            gols2t: 10,
            gols1t_pct: 0.52,
            gols2t_pct: 0.48,
            scored: 7,
            cleanSheet: 3,
          },
        },
      },
      bf_odds_live: {
        match_odds: {
          marketId: "1.206606038",
          marketName: "Match Odds",
          totalMatched: 107603.75,
          home_odd: 1.3,
          draw_odd: 5.1,
          away_odd: 20,
          isMarketDataDelayed: true,
          betDelay: 5,
          lastMatchTime: "2022-11-19T16:11:12.868Z",
          status: "OPEN",
          runners_status: "ACTIVE",
        },
        over_under_2_5: {
          marketId: "1.206606083",
          marketName: "Over/Under 2.5 Goals",
          totalMatched: 79782.47,
          under_odd: 1.43,
          over_odd: 3.2,
          over_odd_lastPriceTraded: 3.15,
          isMarketDataDelayed: true,
          betDelay: 5,
          lastMatchTime: "2022-11-19T16:10:53.121Z",
          status: "OPEN",
          runners_status: "ACTIVE",
          under_odd_lastPriceTraded: 1.45,
        },
        over_under_0_5_HT: {
          marketId: "1.206606041",
          marketName: "First Half Goals 0.5",
          totalMatched: 16176.7,
          under_odd: 1.02,
          over_odd: 1.05,
          isMarketDataDelayed: true,
          betDelay: 5,
          status: "CLOSED",
          runners_status: "ACTIVE",
          under_odd_lastPriceTraded: 2.2,
          over_odd_lastPriceTraded: 1.85,
          lastMatchTime: "2022-11-19T15:43:07.178Z",
        },
      },
      bf_odds_live_history: {
        match_odds: {
          marketId: "1.206606038",
          history: [
            {
              m: 0,
              h: 2.24,
              d: 3.05,
              a: 3.5,
            },
            {
              m: 0,
              h: 2.22,
              d: 3.35,
              a: 3.85,
            },
            {
              m: 0,
              h: 2.2,
              d: 3.3,
              a: 3.9,
            },
            {
              m: 0,
              h: 2.2,
              d: 3.3,
              a: 3.95,
            },
            {
              m: 0,
              h: 2.22,
              d: 3.3,
              a: 3.95,
            },
            {
              m: 1,
              h: 2.14,
              d: 3.35,
              a: 3.9,
            },
            {
              m: 3,
              h: 2.24,
              d: 3.25,
              a: 3.9,
            },
            {
              m: 5,
              h: 2.14,
              d: 3.3,
              a: 4,
            },
            {
              m: 7,
              h: 2.14,
              d: 3.25,
              a: 4.1,
            },
            {
              m: 9,
              h: 2.18,
              d: 3.2,
              a: 4.1,
            },
            {
              m: 11,
              h: 2.22,
              d: 3.15,
              a: 4,
            },
            {
              m: 13,
              h: 2.26,
              d: 3.1,
              a: 3.9,
            },
            {
              m: 15,
              h: 2.24,
              d: 3.1,
              a: 3.9,
            },
            {
              m: 17,
              h: 1.39,
              d: 4.5,
              a: 9.2,
            },
            {
              m: 21,
              h: 1.41,
              d: 4.7,
              a: 11,
            },
            {
              m: 22,
              h: 1.41,
              d: 4.7,
              a: 11,
            },
            {
              m: 23,
              h: 1.41,
              d: 4.7,
              a: 11,
            },
            {
              m: 25,
              h: 1.41,
              d: 4.7,
              a: 11.5,
            },
            {
              m: 27,
              h: 1.39,
              d: 4.7,
              a: 11.5,
            },
            {
              m: 30,
              h: 1.36,
              d: 4.8,
              a: 12.5,
            },
            {
              m: 31,
              h: 1.35,
              d: 4.8,
              a: 13,
            },
            {
              m: 33,
              h: 1.33,
              d: 4.9,
              a: 15.5,
            },
            {
              m: 35,
              h: 1.32,
              d: 5,
              a: 16.5,
            },
            {
              m: 37,
              h: 1.32,
              d: 4.9,
              a: 18,
            },
            {
              m: 39,
              h: 1.31,
              d: 5,
              a: 19,
            },
            {
              m: 45,
              h: 1.3,
              d: 5.1,
              a: 20,
            },
          ],
        },
        over_under_2_5: {
          marketId: "1.206606083",
          history: [
            {
              m: 0,
              o: 2.38,
              u: 1.55,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.62,
            },
            {
              m: 0,
              o: 2.56,
              u: 1.62,
            },
            {
              m: 0,
              o: 2.62,
              u: 1.61,
            },
            {
              m: 0,
              o: 2.62,
              u: 1.61,
            },
            {
              m: 1,
              o: 2.46,
              u: 1.57,
            },
            {
              m: 3,
              o: 2.6,
              u: 1.59,
            },
            {
              m: 5,
              o: 2.62,
              u: 1.6,
            },
            {
              m: 7,
              o: 2.74,
              u: 1.55,
            },
            {
              m: 9,
              o: 2.78,
              u: 1.53,
            },
            {
              m: 11,
              o: 2.8,
              u: 1.53,
            },
            {
              m: 13,
              o: 3,
              u: 1.47,
            },
            {
              m: 15,
              o: 3,
              u: 1.47,
            },
            {
              m: 17,
              o: 1.75,
              u: 2.3,
            },
            {
              m: 21,
              o: 1.8,
              u: 2.22,
            },
            {
              m: 22,
              o: 1.8,
              u: 2.22,
            },
            {
              m: 23,
              o: 1.83,
              u: 2.12,
            },
            {
              m: 25,
              o: 1.91,
              u: 2.04,
            },
            {
              m: 27,
              o: 1.93,
              u: 2.04,
            },
            {
              m: 30,
              o: 2.08,
              u: 1.86,
            },
            {
              m: 31,
              o: 2.14,
              u: 1.82,
            },
            {
              m: 33,
              o: 2.42,
              u: 1.69,
            },
            {
              m: 35,
              o: 2.64,
              u: 1.57,
            },
            {
              m: 37,
              o: 2.64,
              u: 1.57,
            },
            {
              m: 39,
              o: 2.86,
              u: 1.52,
            },
            {
              m: 45,
              o: 3.2,
              u: 1.43,
            },
          ],
        },
        over_under_0_5_HT: {
          marketId: "1.206606041",
          history: [
            {
              m: 0,
              o: 1.47,
              u: 2.5,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.62,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.62,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.62,
            },
            {
              m: 0,
              o: 1.58,
              u: 2.62,
            },
            {
              m: 1,
              o: 1.58,
              u: 2.62,
            },
            {
              m: 3,
              o: 1.58,
              u: 2.6,
            },
            {
              m: 5,
              o: 1.6,
              u: 2.62,
            },
            {
              m: 7,
              o: 1.63,
              u: 2.52,
            },
            {
              m: 9,
              o: 1.66,
              u: 2.48,
            },
            {
              m: 11,
              o: 1.71,
              u: 2.32,
            },
            {
              m: 13,
              o: 1.82,
              u: 2.16,
            },
            {
              m: 15,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 17,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 21,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 22,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 23,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 25,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 27,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 30,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 31,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 33,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 35,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 37,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 39,
              o: 1.05,
              u: 1.02,
            },
            {
              m: 45,
              o: 1.05,
              u: 1.02,
            },
          ],
        },
      },
      bsf_odds_live_history: {
        match_odds: {
          history: [
            {
              m: 0,
              h: "2.000",
              d: "3.400",
              a: "3.200",
              ss: null,
            },
            {
              m: 0,
              h: "2.000",
              d: "3.400",
              a: "3.200",
              ss: null,
            },
            {
              m: 0,
              h: "2.000",
              d: "3.300",
              a: "3.250",
              ss: null,
            },
            {
              m: 0,
              h: "2.000",
              d: "3.300",
              a: "3.250",
              ss: null,
            },
            {
              m: 0,
              h: "2.000",
              d: "3.300",
              a: "3.250",
              ss: null,
            },
            {
              m: 1,
              h: "2.000",
              d: "3.300",
              a: "3.250",
              ss: null,
            },
            {
              m: 3,
              h: "2.000",
              d: "3.300",
              a: "3.250",
              ss: null,
            },
            {
              m: 5,
              h: "2.050",
              d: "3.400",
              a: "3.400",
              ss: "0-0",
            },
            {
              m: 7,
              h: "2.050",
              d: "3.400",
              a: "3.600",
              ss: "0-0",
            },
            {
              m: 9,
              h: "2.050",
              d: "3.250",
              a: "3.600",
              ss: "0-0",
            },
            {
              m: 11,
              h: "2.050",
              d: "3.250",
              a: "3.600",
              ss: "0-0",
            },
            {
              m: 13,
              h: "2.200",
              d: "3.200",
              a: "3.400",
              ss: "0-0",
            },
            {
              m: 15,
              h: "2.100",
              d: "3.200",
              a: "3.500",
              ss: "0-0",
            },
            {
              m: 17,
              h: "1.333",
              d: "4.750",
              a: "8.500",
              ss: "1-0",
            },
            {
              m: 21,
              h: "1.333",
              d: "4.750",
              a: "9.000",
              ss: "1-0",
            },
            {
              m: 22,
              h: "1.333",
              d: "4.500",
              a: "9.000",
              ss: "1-0",
            },
            {
              m: 23,
              h: "1.333",
              d: "4.500",
              a: "9.000",
              ss: "1-0",
            },
            {
              m: 25,
              h: "1.333",
              d: "4.500",
              a: "9.500",
              ss: "1-0",
            },
            {
              m: 27,
              h: "1.333",
              d: "4.750",
              a: "10.000",
              ss: "1-0",
            },
            {
              m: 30,
              h: "1.300",
              d: "4.750",
              a: "11.000",
              ss: "1-0",
            },
            {
              m: 31,
              h: "1.285",
              d: "4.750",
              a: "12.000",
              ss: "1-0",
            },
            {
              m: 33,
              h: "1.285",
              d: "4.750",
              a: "13.000",
              ss: "1-0",
            },
            {
              m: 35,
              h: "1.250",
              d: "4.750",
              a: "13.000",
              ss: "1-0",
            },
            {
              m: 37,
              h: "1.250",
              d: "5.000",
              a: "15.000",
              ss: "1-0",
            },
            {
              m: 39,
              h: "1.250",
              d: "4.750",
              a: "15.000",
              ss: "1-0",
            },
            {
              m: 45,
              h: "1.222",
              d: "5.000",
              a: "17.000",
              ss: "1-0",
            },
          ],
        },
        match_odds_HT: {
          history: [
            {
              m: 0,
              h: 0,
              d: 0,
              a: 0,
              ss: 0,
            },
            {
              m: 0,
              h: 0,
              d: 0,
              a: 0,
              ss: 0,
            },
            {
              m: 0,
              h: "2.875",
              d: "2.000",
              a: "4.333",
              ss: null,
            },
            {
              m: 0,
              h: "2.875",
              d: "2.000",
              a: "4.333",
              ss: null,
            },
            {
              m: 0,
              h: "2.875",
              d: "2.000",
              a: "4.333",
              ss: null,
            },
            {
              m: 1,
              h: "2.875",
              d: "2.000",
              a: "4.333",
              ss: null,
            },
            {
              m: 3,
              h: "2.875",
              d: "2.000",
              a: "4.333",
              ss: null,
            },
            {
              m: 5,
              h: "2.875",
              d: "1.952",
              a: "4.500",
              ss: "0-0",
            },
            {
              m: 7,
              h: "2.750",
              d: "1.909",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 9,
              h: "2.875",
              d: "1.909",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 11,
              h: "3.000",
              d: "1.833",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 13,
              h: "3.250",
              d: "1.800",
              a: "4.750",
              ss: "0-0",
            },
            {
              m: 15,
              h: "3.200",
              d: "1.727",
              a: "5.000",
              ss: "0-0",
            },
            {
              m: 17,
              h: "1.200",
              d: "5.000",
              a: "23.000",
              ss: "1-0",
            },
            {
              m: 21,
              h: "1.166",
              d: "5.500",
              a: "26.000",
              ss: "1-0",
            },
            {
              m: 22,
              h: "1.166",
              d: "5.500",
              a: "29.000",
              ss: "1-0",
            },
            {
              m: 23,
              h: "1.166",
              d: "5.500",
              a: "29.000",
              ss: "1-0",
            },
            {
              m: 25,
              h: "1.166",
              d: "5.500",
              a: "34.000",
              ss: "1-0",
            },
            {
              m: 27,
              h: "1.142",
              d: "5.500",
              a: "41.000",
              ss: "1-0",
            },
            {
              m: 30,
              h: "1.111",
              d: "6.500",
              a: "51.000",
              ss: "1-0",
            },
            {
              m: 31,
              h: "1.100",
              d: "7.000",
              a: "51.000",
              ss: "1-0",
            },
            {
              m: 33,
              h: "1.100",
              d: "7.000",
              a: "67.000",
              ss: "1-0",
            },
            {
              m: 35,
              h: "1.083",
              d: "8.000",
              a: "81.000",
              ss: "1-0",
            },
            {
              m: 37,
              h: "1.071",
              d: "9.000",
              a: "101.000",
              ss: "1-0",
            },
            {
              m: 39,
              h: "1.062",
              d: "10.000",
              a: "101.000",
              ss: "1-0",
            },
            {
              m: 45,
              h: "1.040",
              d: "13.000",
              a: "151.000",
              ss: "1-0",
            },
          ],
        },
      },
      tips: [],
    },
  ];
}
