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
    if(gameJSON.timer){
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
  return brClock
    .replace("1T", "1H")
    .replace("2T", "2H")
    .replace("pre-jogo", "pre-game")
    .replace("intervalo", "half-time");
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
    scores: { "2": { home: "0", away: "0" } },
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
