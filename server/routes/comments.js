const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const db = require('../db');
const { ObjectId } = require('mongodb');

const router = express.Router();

// 댓글 작성
router.post('/:postId/comments', isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.postId;

    // (선택) postId 유효성 체크
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ msg: '잘못된 글 ID입니다.' });
    }

    const result = await db.collection('comments').insertOne({
      comment: req.body.comment,
      authorId: req.user._id,
      authorName: req.user.username,
      postId: postId,   
      createdAt: new Date(),
    });

    res.json({ msg: '댓글 작성함' });
  } catch (err) {
    console.error('❌ 댓글 작성 에러:', err);
    res.status(500).json({ msg: '댓글 작성 중 오류' });
  }
});

// 댓글 목록 불러오기
router.get('/:postId/comments', isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await db
      .collection('comments')
      .find({ postId: postId })      
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ comments });
  } catch (err) {
    console.error('❌ 댓글 불러오기 에러:', err);
    res.status(500).json({ msg: '댓글 불러오기 중 오류' });
  }
});

// 댓글 수정
router.put('/:postId/comments/:commentId', isLoggedIn, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { comment } = req.body;   // 프론트에서 보낼 새 내용

    if (!comment || !comment.trim()) {
      return res.status(400).json({ msg: '댓글 내용을 입력하세요.' });
    }

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ msg: '잘못된 댓글 ID입니다.' });
    }

    // 1) 기존 댓글 찾기
    const existing = await db.collection('comments').findOne({
      _id: new ObjectId(commentId),
    });

    if (!existing) {
      return res.status(404).json({ msg: '댓글을 찾을 수 없습니다.' });
    }

    // (선택) postId까지 검증
    if (String(existing.postId) !== String(postId)) {
      return res.status(400).json({ msg: '잘못된 요청입니다.' });
    }

    // 2) 작성자만 수정 가능
    if (String(existing.authorId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ msg: '본인이 작성한 댓글만 수정할 수 있습니다.' });
    }

    // 3) 실제 수정
    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          comment,
          updatedAt: new Date(),
        },
      }
    );

    res.json({ msg: '댓글이 수정되었습니다.' });
  } catch (err) {
    console.error('❌ 댓글 수정 에러:', err);
    res.status(500).json({ msg: '댓글 수정 중 서버 오류' });
  }
});

// 댓글 삭제
router.delete('/:postId/comments/:commentId', isLoggedIn, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({ msg: '잘못된 댓글 ID입니다.' });
    }

    // 1) 기존 댓글 찾기
    const existing = await db.collection('comments').findOne({
      _id: new ObjectId(commentId),
    });

    if (!existing) {
      return res.status(404).json({ msg: '댓글을 찾을 수 없습니다.' });
    }

    // (선택) postId까지 검증
    if (String(existing.postId) !== String(postId)) {
      return res.status(400).json({ msg: '잘못된 요청입니다.' });
    }

    // 2) 작성자만 삭제 가능
    if (String(existing.authorId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ msg: '본인이 작성한 댓글만 삭제할 수 있습니다.' });
    }

    // 3) 삭제
    await db.collection('comments').deleteOne({
      _id: new ObjectId(commentId),
    });

    res.json({ msg: '댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error('❌ 댓글 삭제 에러:', err);
    res.status(500).json({ msg: '댓글 삭제 중 서버 오류' });
  }
});

module.exports = router;
