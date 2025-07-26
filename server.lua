
local QBCore = exports['qb-core']:GetCoreObject()



QBCore.Functions.CreateUseableItem('karta',function(source)
    local player = QBCore.Functions.GetPlayer(source)
    print(player)
    if player then
        TriggerClientEvent('sg-miniui:client:openUi', source)
    else
        QBCore.Functions.Notify(source, "ERROR", "error")
    end
    
end)


RegisterNetEvent("uponClosing", function()
    local src = source

    local player = QBCore.Functions.GetPlayer(src)
    if player then
        if(player.Functions.RemoveItem('karta', 1)) then
        print("Item karta removed from player: " .. tostring(player))
        else
            print("Failed to remove item karta from player: " .. tostring(player))
        end
    else
        print("Player not found for source: " .. src)
    end
    
end)