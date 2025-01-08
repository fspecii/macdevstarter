const SYSTEM_PREFERENCES = {
    dock: {
        title: "Dock Settings",
        items: [
            { id: "autohide-dock", name: "Auto-hide Dock", command: "defaults write com.apple.dock autohide -bool true" },
            { id: "dock-magnification", name: "Enable Dock magnification", command: "defaults write com.apple.dock magnification -bool true" },
            { id: "minimize-effect", name: "Change minimize effect to scale", command: "defaults write com.apple.dock mineffect -string 'scale'" }
        ]
    },
    finder: {
        title: "Finder Settings",
        items: [
            { id: "show-hidden-files", name: "Show hidden files", command: "defaults write com.apple.finder AppleShowAllFiles -bool true" },
            { id: "show-path-bar", name: "Show path bar", command: "defaults write com.apple.finder ShowPathbar -bool true" },
            { id: "show-status-bar", name: "Show status bar", command: "defaults write com.apple.finder ShowStatusBar -bool true" },
            { id: "file-extensions", name: "Show all file extensions", command: "defaults write NSGlobalDomain AppleShowAllExtensions -bool true" }
        ]
    },
    trackpad: {
        title: "Trackpad Settings",
        items: [
            { id: "tap-to-click", name: "Enable tap to click", command: "defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true" },
            { id: "three-finger-drag", name: "Enable three finger drag", command: "defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerDrag -bool true" }
        ]
    },
    keyboard: {
        title: "Keyboard Settings",
        items: [
            { id: "key-repeat", name: "Fast key repeat", command: "defaults write NSGlobalDomain KeyRepeat -int 2" },
            { id: "key-delay", name: "Short delay until repeat", command: "defaults write NSGlobalDomain InitialKeyRepeat -int 15" }
        ]
    },
    screenshots: {
        title: "Screenshot Settings",
        items: [
            { id: "screenshot-location", name: "Save screenshots to Downloads", command: "defaults write com.apple.screencapture location -string '${HOME}/Downloads'" },
            { id: "screenshot-shadow", name: "Disable window screenshot shadow", command: "defaults write com.apple.screencapture disable-shadow -bool true" }
        ]
    },
    security: {
        title: "Security Settings",
        items: [
            { id: "firewall", name: "Enable Firewall", command: "/usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on" },
            { id: "require-password", name: "Require password immediately after sleep", command: "defaults write com.apple.screensaver askForPassword -int 1 && defaults write com.apple.screensaver askForPasswordDelay -int 0" }
        ]
    }
};

export default SYSTEM_PREFERENCES; 