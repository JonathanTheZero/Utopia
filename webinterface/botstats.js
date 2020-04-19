$.getJSON('./../botstats.json', function (data) {
  $("#statbox_first").html(`Currently the Utopia bot is running on ${data.activeServers} servers!`);
  $("#statbox_second").html(`Currently the Utopia bot is used by ${data.users} users!`);
  $("#statbox_third").html(`The bot already executed ${data.commandsRun} commands!`);
});