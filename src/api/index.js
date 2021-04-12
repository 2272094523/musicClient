import {get,post,put,Delete} from './http';

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login`, params)
//添加歌手
export const insertSinger = (params) =>post(`singer/insert`,params)
//查询歌手
export const selectAllSinger = ()=>get('singer/selectAll')
//修改歌手
export const editSinger=(params)=>put('singer/update',params)
//删除歌手
export const deleteSinger=(params)=>Delete(`singer/delete`,params)


//查询某个歌手的所有歌曲
export const selectAllSongBySingerId=(params) =>get(`song/selectAllBySingerId?singerId=${params}`)
//添加歌曲
export const insertSong=(params)=>post(`song/insert`,params)
//修改歌曲信息
export const updateSong=(params)=>post('song/update',params)
//删除歌曲
export const deleteSong=(params)=>post(`song/delete`,params)
//查询曲库中的所有歌曲
export const selectAllSong=()=>get(`song/selectAll`)
//查看曲库中不在某个歌单下的歌曲
export  const selectSongNoInCurrentListSong=(params)=>get(`song/selectNoInList?songListId=${params}`)

//增加歌单
export const insertSongList=(params)=>post(`songlist/insert`,params)
//查询全部歌单
export const selectAllSongList=(prams)=>get(`songlist/selectAll`)
//修改歌单信息
export const updateSongList=(params)=>post(`songlist/update`,params)
//删除歌单
export const deleteSongList=(params)=>post(`songlist/delete`,params)

//查询某个歌单的所有歌曲
export const selectSongOfListSong=(params)=>get(`listsong/selectSongOfListSong?songListId=${params}`)
//移除某个歌单中的某个歌曲
export const deleteSongFromListSong=(params)=>post('listsong/deleteSong',params)
//往当前歌单中添加歌曲
export const insertSongToCurrentList=(params)=>post(`listsong/insertSongToList`,params)



//查询系统所有用户
export const selectAllConsumer=()=>get('consumer/selectAll')



//查询系统中歌手总数，用户总数，歌单总数，歌曲总数

export const selectAllTotals=()=>get('communal/selectAllTotals')






