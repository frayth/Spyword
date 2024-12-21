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
  theme:{
    colors:{
      veryCool: 'rgb(255,0,0)', // class="text-very-cool"
    }
  },
  rules:[
    [/^flex-center(-col)?$/,([, col]) =>({
      display: 'flex',
      'place-items': 'center',
      ...(col ? { 'flex-direction': 'column' } : {}),
    })],
    [/^pborder-(\d+)$/,([,d])=>({border:`${d}px solid #fbbf24`})],
    ['grid-center',{display:'grid','place-items':'center'}],
  ],shortcuts:{
    'card':'shadow-xl bg-white color-white rounded-lg font-size-3 sm:(font-size-4)  ',
    'title':'font-bold text-size-5 sm:(text-size-xl) color-black',
  }
  // ...UnoCSS options
})