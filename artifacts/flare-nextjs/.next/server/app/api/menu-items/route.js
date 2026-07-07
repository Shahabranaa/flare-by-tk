/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/menu-items/route";
exports.ids = ["app/api/menu-items/route"];
exports.modules = {

/***/ "(rsc)/./app/api/menu-items/route.ts":
/*!*************************************!*\
  !*** ./app/api/menu-items/route.ts ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_db__WEBPACK_IMPORTED_MODULE_1__]);\n_lib_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nasync function GET(req) {\n    const sp = req.nextUrl.searchParams;\n    const available = sp.get('available');\n    const categoryId = sp.get('categoryId');\n    const featured = sp.get('featured');\n    try {\n        const conditions = [];\n        const params = [];\n        if (available === 'true') {\n            params.push(true);\n            conditions.push(`mi.is_available = $${params.length}`);\n        }\n        if (featured === 'true') {\n            params.push(true);\n            conditions.push(`mi.is_featured = $${params.length}`);\n        }\n        if (categoryId) {\n            params.push(parseInt(categoryId));\n            conditions.push(`mi.category_id = $${params.length}`);\n        }\n        const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';\n        const rows = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__.sql)(`\n      SELECT mi.id, mi.name, mi.slug, mi.description,\n             mi.category_id AS \"categoryId\", c.name AS \"categoryName\",\n             mi.price::float AS price,\n             mi.original_price::float AS \"originalPrice\",\n             mi.image_url AS \"imageUrl\",\n             mi.is_available AS \"isAvailable\",\n             mi.is_featured AS \"isFeatured\",\n             mi.calories, mi.tags\n      FROM menu_items mi\n      LEFT JOIN categories c ON mi.category_id = c.id\n      ${where}\n      ORDER BY mi.category_id, mi.name\n    `, params);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(rows);\n    } catch (e) {\n        console.error(e);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed'\n        }, {\n            status: 500\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21lbnUtaXRlbXMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQXdEO0FBQ3pCO0FBRXhCLGVBQWVFLElBQUlDLEdBQWdCO0lBQ3hDLE1BQU1DLEtBQUtELElBQUlFLE9BQU8sQ0FBQ0MsWUFBWTtJQUNuQyxNQUFNQyxZQUFZSCxHQUFHSSxHQUFHLENBQUM7SUFDekIsTUFBTUMsYUFBYUwsR0FBR0ksR0FBRyxDQUFDO0lBQzFCLE1BQU1FLFdBQVdOLEdBQUdJLEdBQUcsQ0FBQztJQUV4QixJQUFJO1FBQ0YsTUFBTUcsYUFBdUIsRUFBRTtRQUMvQixNQUFNQyxTQUFvQixFQUFFO1FBRTVCLElBQUlMLGNBQWMsUUFBUTtZQUFFSyxPQUFPQyxJQUFJLENBQUM7WUFBT0YsV0FBV0UsSUFBSSxDQUFDLENBQUMsbUJBQW1CLEVBQUVELE9BQU9FLE1BQU0sRUFBRTtRQUFHO1FBQ3ZHLElBQUlKLGFBQWEsUUFBUTtZQUFFRSxPQUFPQyxJQUFJLENBQUM7WUFBT0YsV0FBV0UsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUVELE9BQU9FLE1BQU0sRUFBRTtRQUFHO1FBQ3JHLElBQUlMLFlBQVk7WUFBRUcsT0FBT0MsSUFBSSxDQUFDRSxTQUFTTjtZQUFjRSxXQUFXRSxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRUQsT0FBT0UsTUFBTSxFQUFFO1FBQUc7UUFFNUcsTUFBTUUsUUFBUUwsV0FBV0csTUFBTSxHQUFHLFdBQVdILFdBQVdNLElBQUksQ0FBQyxXQUFXO1FBRXhFLE1BQU1DLE9BQU8sTUFBTWpCLDRDQUFHQSxDQUFDLENBQUM7Ozs7Ozs7Ozs7O01BV3RCLEVBQUVlLE1BQU07O0lBRVYsQ0FBQyxFQUFFSjtRQUNILE9BQU9aLHFEQUFZQSxDQUFDbUIsSUFBSSxDQUFDRDtJQUMzQixFQUFFLE9BQU9FLEdBQUc7UUFDVkMsUUFBUUMsS0FBSyxDQUFDRjtRQUNkLE9BQU9wQixxREFBWUEsQ0FBQ21CLElBQUksQ0FBQztZQUFFRyxPQUFPO1FBQVMsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDOUQ7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcnRpZmFjdHMvZmxhcmUtbmV4dGpzL2FwcC9hcGkvbWVudS1pdGVtcy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgc3FsIH0gZnJvbSAnQC9saWIvZGInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3Qgc3AgPSByZXEubmV4dFVybC5zZWFyY2hQYXJhbXM7XG4gIGNvbnN0IGF2YWlsYWJsZSA9IHNwLmdldCgnYXZhaWxhYmxlJyk7XG4gIGNvbnN0IGNhdGVnb3J5SWQgPSBzcC5nZXQoJ2NhdGVnb3J5SWQnKTtcbiAgY29uc3QgZmVhdHVyZWQgPSBzcC5nZXQoJ2ZlYXR1cmVkJyk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBjb25kaXRpb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IHBhcmFtczogdW5rbm93bltdID0gW107XG5cbiAgICBpZiAoYXZhaWxhYmxlID09PSAndHJ1ZScpIHsgcGFyYW1zLnB1c2godHJ1ZSk7IGNvbmRpdGlvbnMucHVzaChgbWkuaXNfYXZhaWxhYmxlID0gJCR7cGFyYW1zLmxlbmd0aH1gKTsgfVxuICAgIGlmIChmZWF0dXJlZCA9PT0gJ3RydWUnKSB7IHBhcmFtcy5wdXNoKHRydWUpOyBjb25kaXRpb25zLnB1c2goYG1pLmlzX2ZlYXR1cmVkID0gJCR7cGFyYW1zLmxlbmd0aH1gKTsgfVxuICAgIGlmIChjYXRlZ29yeUlkKSB7IHBhcmFtcy5wdXNoKHBhcnNlSW50KGNhdGVnb3J5SWQpKTsgY29uZGl0aW9ucy5wdXNoKGBtaS5jYXRlZ29yeV9pZCA9ICQke3BhcmFtcy5sZW5ndGh9YCk7IH1cblxuICAgIGNvbnN0IHdoZXJlID0gY29uZGl0aW9ucy5sZW5ndGggPyAnV0hFUkUgJyArIGNvbmRpdGlvbnMuam9pbignIEFORCAnKSA6ICcnO1xuXG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IHNxbChgXG4gICAgICBTRUxFQ1QgbWkuaWQsIG1pLm5hbWUsIG1pLnNsdWcsIG1pLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgIG1pLmNhdGVnb3J5X2lkIEFTIFwiY2F0ZWdvcnlJZFwiLCBjLm5hbWUgQVMgXCJjYXRlZ29yeU5hbWVcIixcbiAgICAgICAgICAgICBtaS5wcmljZTo6ZmxvYXQgQVMgcHJpY2UsXG4gICAgICAgICAgICAgbWkub3JpZ2luYWxfcHJpY2U6OmZsb2F0IEFTIFwib3JpZ2luYWxQcmljZVwiLFxuICAgICAgICAgICAgIG1pLmltYWdlX3VybCBBUyBcImltYWdlVXJsXCIsXG4gICAgICAgICAgICAgbWkuaXNfYXZhaWxhYmxlIEFTIFwiaXNBdmFpbGFibGVcIixcbiAgICAgICAgICAgICBtaS5pc19mZWF0dXJlZCBBUyBcImlzRmVhdHVyZWRcIixcbiAgICAgICAgICAgICBtaS5jYWxvcmllcywgbWkudGFnc1xuICAgICAgRlJPTSBtZW51X2l0ZW1zIG1pXG4gICAgICBMRUZUIEpPSU4gY2F0ZWdvcmllcyBjIE9OIG1pLmNhdGVnb3J5X2lkID0gYy5pZFxuICAgICAgJHt3aGVyZX1cbiAgICAgIE9SREVSIEJZIG1pLmNhdGVnb3J5X2lkLCBtaS5uYW1lXG4gICAgYCwgcGFyYW1zKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24ocm93cyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwic3FsIiwiR0VUIiwicmVxIiwic3AiLCJuZXh0VXJsIiwic2VhcmNoUGFyYW1zIiwiYXZhaWxhYmxlIiwiZ2V0IiwiY2F0ZWdvcnlJZCIsImZlYXR1cmVkIiwiY29uZGl0aW9ucyIsInBhcmFtcyIsInB1c2giLCJsZW5ndGgiLCJwYXJzZUludCIsIndoZXJlIiwiam9pbiIsInJvd3MiLCJqc29uIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/menu-items/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pool: () => (/* binding */ pool),\n/* harmony export */   sql: () => (/* binding */ sql)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([pg__WEBPACK_IMPORTED_MODULE_0__]);\npg__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst g = globalThis;\nconst pool = g._pgPool ?? new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    connectionString: process.env.DATABASE_URL,\n    max: 5\n});\nif (true) g._pgPool = pool;\nasync function sql(query, params) {\n    const { rows } = await pool.query(query, params);\n    return rows;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTBCO0FBRTFCLE1BQU1DLElBQUlDO0FBRUgsTUFBTUMsT0FBT0YsRUFBRUcsT0FBTyxJQUFJLElBQUlKLG9DQUFJQSxDQUFDO0lBQ3hDSyxrQkFBa0JDLFFBQVFDLEdBQUcsQ0FBQ0MsWUFBWTtJQUMxQ0MsS0FBSztBQUNQLEdBQUc7QUFFSCxJQUFJSCxJQUFxQyxFQUFFTCxFQUFFRyxPQUFPLEdBQUdEO0FBRWhELGVBQWVPLElBQ3BCQyxLQUFhLEVBQ2JDLE1BQWtCO0lBRWxCLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEdBQUcsTUFBTVYsS0FBS1EsS0FBSyxDQUFDQSxPQUFPQztJQUN6QyxPQUFPQztBQUNUIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FydGlmYWN0cy9mbGFyZS1uZXh0anMvbGliL2RiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvb2wgfSBmcm9tICdwZyc7XG5cbmNvbnN0IGcgPSBnbG9iYWxUaGlzIGFzIHR5cGVvZiBnbG9iYWxUaGlzICYgeyBfcGdQb29sPzogUG9vbCB9O1xuXG5leHBvcnQgY29uc3QgcG9vbCA9IGcuX3BnUG9vbCA/PyBuZXcgUG9vbCh7XG4gIGNvbm5lY3Rpb25TdHJpbmc6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCxcbiAgbWF4OiA1LFxufSk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnLl9wZ1Bvb2wgPSBwb29sO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3FsPFQgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHBhcmFtcz86IHVua25vd25bXVxuKTogUHJvbWlzZTxUW10+IHtcbiAgY29uc3QgeyByb3dzIH0gPSBhd2FpdCBwb29sLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpO1xuICByZXR1cm4gcm93cyBhcyBUW107XG59XG4iXSwibmFtZXMiOlsiUG9vbCIsImciLCJnbG9iYWxUaGlzIiwicG9vbCIsIl9wZ1Bvb2wiLCJjb25uZWN0aW9uU3RyaW5nIiwicHJvY2VzcyIsImVudiIsIkRBVEFCQVNFX1VSTCIsIm1heCIsInNxbCIsInF1ZXJ5IiwicGFyYW1zIiwicm93cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-items%2Froute&page=%2Fapi%2Fmenu-items%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-items%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-items%2Froute&page=%2Fapi%2Fmenu-items%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-items%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_artifacts_flare_nextjs_app_api_menu_items_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/menu-items/route.ts */ \"(rsc)/./app/api/menu-items/route.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_home_runner_workspace_artifacts_flare_nextjs_app_api_menu_items_route_ts__WEBPACK_IMPORTED_MODULE_3__]);\n_home_runner_workspace_artifacts_flare_nextjs_app_api_menu_items_route_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/menu-items/route\",\n        pathname: \"/api/menu-items\",\n        filename: \"route\",\n        bundlePath: \"app/api/menu-items/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/artifacts/flare-nextjs/app/api/menu-items/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_artifacts_flare_nextjs_app_api_menu_items_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtZW51LWl0ZW1zJTJGcm91dGUmcGFnZT0lMkZhcGklMkZtZW51LWl0ZW1zJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbWVudS1pdGVtcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXJ0aWZhY3RzJTJGZmxhcmUtbmV4dGpzJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXJ0aWZhY3RzJTJGZmxhcmUtbmV4dGpzJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN5QjtBQUN0RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYscUMiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcnRpZmFjdHMvZmxhcmUtbmV4dGpzL2FwcC9hcGkvbWVudS1pdGVtcy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvbWVudS1pdGVtcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21lbnUtaXRlbXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL21lbnUtaXRlbXMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FydGlmYWN0cy9mbGFyZS1uZXh0anMvYXBwL2FwaS9tZW51LWl0ZW1zL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-items%2Froute&page=%2Fapi%2Fmenu-items%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-items%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = import("pg");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmenu-items%2Froute&page=%2Fapi%2Fmenu-items%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmenu-items%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();