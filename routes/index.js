/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-16 19:35:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-05 16:04:20
 */
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.get('/do-ex', async (ctx, next) => {
    await ctx.render('do-ex', {
        title: 'Hello Koa 2!'
    })
})


router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
    ctx.body = [
        {
            a: 'koa2 json',
            b: 'aaa'
        },
        {
            a: 'koa2 json',
            b: 'aaa'
        }
    ];
})

module.exports = router
