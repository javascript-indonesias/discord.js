'use strict';

const { ChannelType, MessageType, ComponentType, ImageFormat, StickerFormatType } = require('discord-api-types/v10');

/**
 * Max bulk deletable message age
 * @typedef {number} MaxBulkDeletableMessageAge
 */
exports.MaxBulkDeletableMessageAge = 1_209_600_000;

/**
 * The name of an item to be swept in Sweepers
 * * `autoModerationRules`
 * * `applicationCommands` - both global and guild commands
 * * `bans`
 * * `emojis`
 * * `invites` - accepts the `lifetime` property, using it will sweep based on expires timestamp
 * * `guildMembers`
 * * `messages` - accepts the `lifetime` property, using it will sweep based on edited or created timestamp
 * * `presences`
 * * `reactions`
 * * `stageInstances`
 * * `stickers`
 * * `threadMembers`
 * * `threads` - accepts the `lifetime` property, using it will sweep archived threads based on archived timestamp
 * * `users`
 * * `voiceStates`
 * @typedef {string} SweeperKey
 */
exports.SweeperKeys = [
  'autoModerationRules',
  'applicationCommands',
  'bans',
  'emojis',
  'invites',
  'guildMembers',
  'messages',
  'presences',
  'reactions',
  'stageInstances',
  'stickers',
  'threadMembers',
  'threads',
  'users',
  'voiceStates',
];

/**
 * The types of messages that are not `System`. The available types are:
 * * {@link MessageType.Default}
 * * {@link MessageType.Reply}
 * * {@link MessageType.ChatInputCommand}
 * * {@link MessageType.ContextMenuCommand}
 * @typedef {MessageType[]} NonSystemMessageTypes
 */
exports.NonSystemMessageTypes = [
  MessageType.Default,
  MessageType.Reply,
  MessageType.ChatInputCommand,
  MessageType.ContextMenuCommand,
];

/**
 * The guild channels that are text-based.
 * * TextChannel
 * * NewsChannel
 * * ThreadChannel
 * * VoiceChannel
 * * StageChannel
 * @typedef {TextChannel|NewsChannel|ThreadChannel|VoiceChannel|StageChannel} GuildTextBasedChannel
 */

/**
 * The channels that are text-based.
 * * DMChannel
 * * GuildTextBasedChannel
 * @typedef {DMChannel|GuildTextBasedChannel} TextBasedChannels
 */

/**
 * Data that resolves to give a text-based channel. This can be:
 * * A text-based channel
 * * A snowflake
 * @typedef {TextBasedChannels|Snowflake} TextBasedChannelsResolvable
 */

/**
 * The types of channels that are text-based. The available types are:
 * * {@link ChannelType.DM}
 * * {@link ChannelType.GuildText}
 * * {@link ChannelType.GuildAnnouncement}
 * * {@link ChannelType.AnnouncementThread}
 * * {@link ChannelType.PublicThread}
 * * {@link ChannelType.PrivateThread}
 * * {@link ChannelType.GuildVoice}
 * @typedef {ChannelType[]} TextBasedChannelTypes
 */
exports.TextBasedChannelTypes = [
  ChannelType.DM,
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
  ChannelType.GuildVoice,
];

/**
 * The types of channels that are threads. The available types are:
 * * {@link ChannelType.AnnouncementThread}
 * * {@link ChannelType.PublicThread}
 * * {@link ChannelType.PrivateThread}
 * @typedef {ChannelType[]} ThreadChannelTypes
 */
exports.ThreadChannelTypes = [ChannelType.AnnouncementThread, ChannelType.PublicThread, ChannelType.PrivateThread];

/**
 * The types of channels that are voice-based. The available types are:
 * * {@link ChannelType.GuildVoice}
 * * {@link ChannelType.GuildStageVoice}
 * @typedef {ChannelType[]} VoiceBasedChannelTypes
 */
exports.VoiceBasedChannelTypes = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];

/**
 * The types of select menus. The available types are:
 * * {@link ComponentType.StringSelect}
 * * {@link ComponentType.UserSelect}
 * * {@link ComponentType.RoleSelect}
 * * {@link ComponentType.MentionableSelect}
 * * {@link ComponentType.ChannelSelect}
 * @typedef {ComponentType[]} SelectMenuTypes
 */
exports.SelectMenuTypes = [
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.MentionableSelect,
  ComponentType.ChannelSelect,
];

/**
 * The types of messages that can be deleted. The available types are:
 * * {@link MessageType.AutoModerationAction}
 * * {@link MessageType.ChannelFollowAdd}
 * * {@link MessageType.ChannelPinnedMessage}
 * * {@link MessageType.ChatInputCommand}
 * * {@link MessageType.ContextMenuCommand}
 * * {@link MessageType.Default}
 * * {@link MessageType.GuildBoost}
 * * {@link MessageType.GuildBoostTier1}
 * * {@link MessageType.GuildBoostTier2}
 * * {@link MessageType.GuildBoostTier3}
 * * {@link MessageType.GuildInviteReminder}
 * * {@link MessageType.InteractionPremiumUpsell}
 * * {@link MessageType.Reply}
 * * {@link MessageType.RoleSubscriptionPurchase}
 * * {@link MessageType.StageEnd}
 * * {@link MessageType.StageRaiseHand}
 * * {@link MessageType.StageSpeaker}
 * * {@link MessageType.StageStart}
 * * {@link MessageType.StageTopic}
 * * {@link MessageType.ThreadCreated}
 * * {@link MessageType.UserJoin}
 * @typedef {MessageType[]} DeletableMessageTypes
 */
exports.DeletableMessageTypes = [
  MessageType.AutoModerationAction,
  MessageType.ChannelFollowAdd,
  MessageType.ChannelPinnedMessage,
  MessageType.ChatInputCommand,
  MessageType.ContextMenuCommand,
  MessageType.Default,
  MessageType.GuildBoost,
  MessageType.GuildBoostTier1,
  MessageType.GuildBoostTier2,
  MessageType.GuildBoostTier3,
  MessageType.GuildInviteReminder,
  MessageType.InteractionPremiumUpsell,
  MessageType.Reply,
  MessageType.RoleSubscriptionPurchase,
  MessageType.StageEnd,
  MessageType.StageRaiseHand,
  MessageType.StageSpeaker,
  MessageType.StageStart,
  MessageType.StageTopic,
  MessageType.ThreadCreated,
  MessageType.UserJoin,
];

/**
 * A mapping between sticker formats and their respective image formats.
 * * {@link StickerFormatType.PNG} -> {@link ImageFormat.PNG}
 * * {@link StickerFormatType.APNG} -> {@link ImageFormat.PNG}
 * * {@link StickerFormatType.Lottie} -> {@link ImageFormat.Lottie}
 * * {@link StickerFormatType.GIF} -> {@link ImageFormat.GIF}
 * @typedef {Object} StickerFormatExtensionMap
 */
exports.StickerFormatExtensionMap = {
  [StickerFormatType.PNG]: ImageFormat.PNG,
  [StickerFormatType.APNG]: ImageFormat.PNG,
  [StickerFormatType.Lottie]: ImageFormat.Lottie,
  [StickerFormatType.GIF]: ImageFormat.GIF,
};

/**
 * @typedef {Object} Constants Constants that can be used in an enum or object-like way.
 * @property {number} MaxBulkDeletableMessageAge Max bulk deletable message age
 * @property {SweeperKey[]} SweeperKeys The possible names of items that can be swept in sweepers
 * @property {NonSystemMessageTypes} NonSystemMessageTypes The types of messages that are not deemed a system type
 * @property {TextBasedChannelTypes} TextBasedChannelTypes The types of channels that are text-based
 * @property {ThreadChannelTypes} ThreadChannelTypes The types of channels that are threads
 * @property {VoiceBasedChannelTypes} VoiceBasedChannelTypes The types of channels that are voice-based
 * @property {SelectMenuTypes} SelectMenuTypes The types of components that are select menus.
 * @property {Object} StickerFormatExtensionMap A mapping between sticker formats and their respective image formats.
 */
