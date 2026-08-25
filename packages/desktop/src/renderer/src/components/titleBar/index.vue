<template>
  <div
    v-if="showTitleBar"
    class="title-bar"
    :class="[
      { active: active },
      { 'tabs-visible': showTabBar },
      { frameless: titleBarStyle === 'custom' },
      { isOsx: isOsx }
    ]"
  >
    <div v-if="showCustomTitleBar" class="left-toolbar title-no-drag">
      <button
        v-for="menu of topLevelMenus"
        :key="menu.key"
        type="button"
        class="menu-item-button"
        @click.stop="handleSubmenuClick($event, menu.key)"
      >
        {{ menu.label.replace('&', '') }}
      </button>
    </div>
    
    <div class="title-bar-spacer" />

    <div class="right-toolbar title-no-drag">
      <el-tooltip
        v-if="wordCount"
        class="item"
        :content="`${wordCount[show]} ${HASH[show].full + (wordCount[show] > 1 ? 's' : '')}`"
        placement="bottom-end"
      >
        <template #content>
          <div class="title-item">
            <span class="front">{{ t('menu.counter.words') }}:</span
            ><span class="text">{{ wordCount['word'] }}</span>
          </div>
          <div class="title-item">
            <span class="front">{{ t('menu.counter.characters') }}:</span
            ><span class="text">{{ wordCount['character'] }}</span>
          </div>
          <div class="title-item">
            <span class="front">{{ t('menu.counter.paragraphs') }}:</span
            ><span class="text">{{ wordCount['paragraph'] }}</span>
          </div>
        </template>
        <div v-if="wordCount" class="word-count" @click.stop="handleWordClick">
          <span class="text-center-vertical">{{ `${HASH[show].short} ${wordCount[show]}` }}</span>
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="wordCount"
        class="item"
        :content="t('commands.view.toggleSourceCodeMode')"
        placement="bottom-end"
      >
        <button
          type="button"
          class="source-mode-toggle"
          :class="{ active: sourceCode }"
          :aria-label="t('commands.view.toggleSourceCodeMode')"
          :aria-pressed="sourceCode"
          @click.stop="toggleSourceMode"
        >
          <span aria-hidden="true">&lt;/&gt;</span>
        </button>
      </el-tooltip>
    </div>
    <div
      v-if="titleBarStyle === 'custom' && !isFullScreen && !isOsx"
      class="window-controls-container title-no-drag"
    >
      <div
        class="frameless-titlebar-button frameless-titlebar-minimize"
        @click.stop="handleMinimizeClick"
      >
        <div>
          <svg width="10" height="10">
            <path :d="windowIconMinimize" />
          </svg>
        </div>
      </div>
      <div
        class="frameless-titlebar-button frameless-titlebar-toggle"
        @click.stop="handleMaximizeClick"
      >
        <div>
          <svg width="10" height="10">
            <path v-show="!isMaximized" :d="windowIconMaximize" />
            <path v-show="isMaximized" :d="windowIconRestore" />
          </svg>
        </div>
      </div>
      <div
        class="frameless-titlebar-button frameless-titlebar-close"
        @click.stop="handleCloseClick"
      >
        <div>
          <svg width="10" height="10">
            <path :d="windowIconClose" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '@/store/preferences.js'
import { useLayoutStore } from '@/store/layout.js'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { minimizePath, restorePath, maximizePath, closePath } from '../../assets/window-controls.js'
import { isOsx as isOsxPlatform } from '@/util'
import { shouldShowInAppTitleBar } from './visibility'
import { useI18n } from 'vue-i18n'
import bus from '@/bus'
import type { FileWordCount } from '@shared/types/files'

interface ProjectInfo {
  name?: string
  [key: string]: unknown
}

const props = defineProps<{
  project?: ProjectInfo | null
  filename?: string
  pathname?: string
  active?: boolean
  wordCount?: FileWordCount | null
  platform?: string
  isSaved?: boolean
}>()

const preferencesStore = usePreferencesStore()
const layoutStore = useLayoutStore()
const { t } = useI18n()

const isOsx = isOsxPlatform
const HASH = {
  word: {
    short: 'W',
    full: 'word'
  },
  character: {
    short: 'C',
    full: 'character'
  },
  paragraph: {
    short: 'P',
    full: 'paragraph'
  },
  all: {
    short: 'A',
    full: '(with space)character'
  }
}
const windowIconMinimize = minimizePath
const windowIconRestore = restorePath
const windowIconMaximize = maximizePath
const windowIconClose = closePath

const isFullScreen = ref(false)
const isMaximized = ref(false)
const show = ref<'word' | 'paragraph' | 'character' | 'all'>('word')

onMounted(async () => {
  try {
    const [fs, max] = await Promise.all([
      window.electron.windowControl.isFullScreen(),
      window.electron.windowControl.isMaximized()
    ])
    isFullScreen.value = !!fs
    isMaximized.value = !!max
  } catch {}
})

const { titleBarStyle, sourceCode } = storeToRefs(preferencesStore)
const { showTabBar } = storeToRefs(layoutStore)

const showCustomTitleBar = computed(() => {
  return titleBarStyle.value === 'custom' && !isOsx
})

const showTitleBar = computed(() => {
  return shouldShowInAppTitleBar(titleBarStyle.value, isOsx)
})

watch(
  () => props.filename,
  (value) => {
    // Set filename when hover on dock
    const hasOpenFolder = !!(props.project && props.project.name)
    const projectName = props.project?.name ?? ''
    let title = ''
    if (value) {
      title = hasOpenFolder ? `${value} - ${projectName}` : `${value}`
    } else {
      title = hasOpenFolder ? projectName : ''
    }

    document.title = title
  }
)

const handleWordClick = () => {
  const ITEMS = ['word', 'paragraph', 'character', 'all'] as const
  const len = ITEMS.length
  let index = ITEMS.indexOf(show.value)
  index += 1
  if (index >= len) index = 0
  show.value = ITEMS[index]!
}

const toggleSourceMode = () => {
  bus.emit('view:toggle-view-entry', 'sourceCode')
}

const handleCloseClick = () => {
  window.electron.windowControl.close()
}

const handleMaximizeClick = async () => {
  if (isFullScreen.value) {
    window.electron.windowControl.setFullScreen(false)
    return
  }
  if (isMaximized.value) window.electron.windowControl.unmaximize()
  else window.electron.windowControl.maximize()
}

const handleMinimizeClick = () => {
  window.electron.windowControl.minimize()
}

const topLevelMenus = computed(() => [
  { key: 'file', label: t('menu.file.file') },
  { key: 'edit', label: t('menu.edit.edit') },
  { key: 'paragraph', label: t('menu.paragraph.title') },
  { key: 'format', label: t('menu.format.format') },
  { key: 'theme', label: t('menu.theme.theme') },
  { key: 'view', label: t('menu.view.view') },
  { key: 'window', label: t('menu.window.title') },
  { key: 'help', label: t('menu.help.help') }
])

const handleSubmenuClick = (event: MouseEvent, menuKey: string) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  window.electron.windowControl.popupSubmenu(menuKey, {
    x: Math.round(rect.left),
    y: Math.round(rect.bottom)
  })
}

const onMaximize = () => {
  isMaximized.value = true
}
const onUnmaximize = () => {
  isMaximized.value = false
}
const onEnterFullScreen = () => {
  isFullScreen.value = true
}
const onLeaveFullScreen = () => {
  isFullScreen.value = false
}

const offMaximize = window.electron.ipcRenderer.on('mt::window-maximize', onMaximize)
const offUnmaximize = window.electron.ipcRenderer.on('mt::window-unmaximize', onUnmaximize)
const offEnterFullScreen = window.electron.ipcRenderer.on(
  'mt::window-enter-full-screen',
  onEnterFullScreen
)
const offLeaveFullScreen = window.electron.ipcRenderer.on(
  'mt::window-leave-full-screen',
  onLeaveFullScreen
)

onBeforeUnmount(() => {
  offMaximize()
  offUnmaximize()
  offEnterFullScreen()
  offLeaveFullScreen()
})
</script>

<style scoped>
.title-bar {
  -webkit-app-region: drag;
  user-select: none;
  background: var(--sideBarBgColor);
  height: var(--titleBarHeight);
  box-sizing: border-box;
  color: var(--sideBarColor);
  position: relative;
  width: 100%;
  z-index: 2;
  transition: color 0.4s ease-in-out;
  cursor: default;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
}
.active {
  color: var(--sideBarTitleColor);
}
img {
  height: 90%;
  margin-top: 1px;
  vertical-align: top;
}

.left-toolbar {
  padding: 0 10px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: nowrap;
}

.title-bar-spacer {
  flex-grow: 1;
  height: 100%;
  min-width: 10px;
}

.menu-item-button {
  -webkit-app-region: no-drag;
  appearance: none;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--sideBarColor);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  line-height: 24px;
  padding: 0 8px;
  margin-right: 4px;
  transition: all 0.25s ease-in-out;

  &:hover {
    background: var(--itemBgColor);
    color: var(--sideBarTitleColor);
  }
}

.right-toolbar {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: nowrap;
  padding-right: 10px;
  & .item {
    margin-right: 10px;
  }
}

.window-controls-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
}

.word-count {
  -webkit-app-region: no-drag;
  cursor: pointer;
  font-size: 14px;
  color: var(--sideBarColor);
  text-align: center;
  line-height: 24px;
  padding: 0 5px;
  box-sizing: border-box;
  transition: all 0.25s ease-in-out;
  & > .text-center-vertical {
    padding: 2px 5px;
    border-radius: 3px;
  }
  &:hover > span {
    background: var(--itemBgColor);
    color: var(--sideBarTitleColor);
  }
}

.source-mode-toggle {
  -webkit-app-region: no-drag;
  appearance: none;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--sideBarColor);
  cursor: pointer;
  font-family: monospace;
  font-size: 13px;
  line-height: 24px;
  min-width: 32px;
  padding: 0 5px;
  transition: all 0.25s ease-in-out;

  &:hover {
    background: var(--itemBgColor);
    color: var(--sideBarTitleColor);
  }

  &.active {
    background: var(--itemBgColor);
    color: var(--themeColor);
  }
}

.title-no-drag {
  -webkit-app-region: no-drag;
}
/* frameless window controls */
.frameless-titlebar-button {
  position: relative;
  display: block;
  width: 46px;
  height: var(--titleBarHeight);
}
.frameless-titlebar-button > div {
  position: absolute;
  display: inline-flex;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.frameless-titlebar-menu {
  color: var(--sideBarColor);
}
.frameless-titlebar-close:hover {
  background-color: rgb(228, 79, 79);
}
.frameless-titlebar-minimize:hover,
.frameless-titlebar-toggle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.frameless-titlebar-button svg {
  fill: #000000;
}
.frameless-titlebar-close:hover svg {
  fill: #ffffff;
}

.text-center-vertical {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}
</style>

<style>
.title-item {
  height: 28px;
  line-height: 28px;
  & .front {
    opacity: 0.7;
  }
  & .text {
    margin-left: 10px;
  }
}
</style>
