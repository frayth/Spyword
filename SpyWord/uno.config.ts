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
    },
    animation:{
      keyframes:{
        bounce:'{0%, 100% { transform: scale(0.5); } 50% { transform: scale(1); }}'
      },
      durations:{
        bounce:'1s'
      },      
      timingFns: {
        bounce: 'cubic-bezier(0.4,0,.6,1)',
      },
      properties: {
        bounce: { 'transform-origin': 'center' },
      },
      counts: {
        bounce: 'infinite',
      },
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
    [/^image-(\d+)$/,([,d])=>({width:`${d}px`,height:`${d}px`})],
    ['translate',{'transform':'translate(-50%,-50%)'}]
  ],shortcuts:{
    'card':'shadow-xl bg-white color-white rounded-lg font-size-3 sm:(font-size-4)  ',
    'title':'font-bold text-size-5 sm:(text-size-xl) color-black',
  }
  // ...UnoCSS options
})