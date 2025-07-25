local QBCore = exports['qb-core']:GetCoreObject()



RegisterCommand('miniui', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "ui",
        status = true
    })
        

end)


RegisterNUICallback("closeUI", function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = "ui",
        status = false
    })
    print("data.correct: " .. tostring(data.correct))
    if data.correct then
        QBCore.Functions.Notify("Correct code!", "success", 2000)
    else
        QBCore.Functions.Notify("Incorrect code.", "error", 2000)
    end
    cb({})

    end)