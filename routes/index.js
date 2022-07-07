/*
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-06-16 19:35:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 18:04:03
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

router.get('/test/:page', async (ctx, next) => {
    await ctx.render(ctx.url.slice(1), {})
})

module.exports = router
