fx_version 'cerulean'
game 'gta5'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}

shared_scripts {
    '@gb-core/shared.lua', -- Loads QBCore shared functions
    '@qb-core/shared/items.lua', -- Loads QBCore items
    'config.lua'
}

client_scripts{
    'client.lua'
}

server_scripts{
    'server.lua'
}

dependencies{
    'qb-core',
    'qb-inventory',
}