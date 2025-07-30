package com.ecoguardian.repository;

import com.ecoguardian.entity.Action;
import com.ecoguardian.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {
    
    List<Action> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT a FROM Action a WHERE a.user = :user ORDER BY a.createdAt DESC")
    List<Action> findRecentActionsByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(a) FROM Action a WHERE a.user = :user")
    long countByUser(@Param("user") User user);
}