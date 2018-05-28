package com.jonas.repository;

import com.jonas.domain.GroceryList;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the GroceryList entity.
 */

@Repository
public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {

    @Query("select grocery_list from GroceryList grocery_list where grocery_list.listOwner.login = ?#{principal.username}")
    List<GroceryList> findByListOwnerIsCurrentUser();
    
    List<GroceryList> findAllGroceryListByListOwnerId(Long id);
    
}
