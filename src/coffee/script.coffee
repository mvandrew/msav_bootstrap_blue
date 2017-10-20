(($) ->

  $(window).on "scroll", (event) => # Обработка отображения кнопки наверх
    if $(@).scrollTop() > 150
      $("#to_top_button").fadeIn "600"
    else
      $("#to_top_button").fadeOut "600"

) jQuery