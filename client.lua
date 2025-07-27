local QBCore = exports['qb-core']:GetCoreObject()
print("Loaded Config:", Config)



RegisterNetEvent("sg-miniui:client:openUi", function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "ui",
        status = true,
        config = Config
    })

end)




RegisterCommand('miniui', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "ui",
        status = true,
        config = Config
    })
       

end)


RegisterNUICallback("closeUI", function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = "ui",
        status = false
    })
    -- Handle the data received from the UI


    TriggerServerEvent("uponClosing")
    if data.correct then
        QBCore.Functions.Notify("Correct code!", "success", 2000)
    else
        QBCore.Functions.Notify("Incorrect code.", "error", 2000)
        
    end
    cb({})

    end)