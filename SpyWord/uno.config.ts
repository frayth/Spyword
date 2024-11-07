import { defineConfig,transformerVariantGroup,presetUno,presetTypography,presetWebFonts} from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets:[
    presetUno(),
    presetScrollbar({

    }),
    presetTypography(),
    presetWebFonts({
      provider:'bunny',
      fonts:{
        default:'Merriweather',
        sans:'Roboto',
      }
    })
  ],
  transformers:[transformerVariantGroup()],
  rules:[
    ['flex-center',{display:'flex','justify-content':'center','align-items':'center'}],
    [/^pborder-(\d+)$/,([,d])=>({border:`${d}px solid #fbbf24`})],
    ['grid-center',{display:'grid','place-items':'center'}],
  ],shortcuts:{
    'card':'shadow-xl bg-white color-white rounded-lg font-size-3 sm:(font-size-4)  ',
  }
  // ...UnoCSS options
})